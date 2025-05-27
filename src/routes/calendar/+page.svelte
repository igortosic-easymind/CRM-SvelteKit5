<script lang="ts">
  import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
  import { invalidate, invalidateAll } from "$app/navigation";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { 
    calendarEvents, 
    calendarView,
    currentCalendarDate,
    setCalendarEventsData,
    setCalendarViewAndDate,
    eventModalOpen,
    eventModalMode,
    selectedEvent,
    selectedDateForEvent,
    selectedTimeForEvent,
    deleteModalOpen,
    eventToDelete,
    createEvent,
    closeEventModal,
    closeDeleteModal,
    removeEventFromStore
  } from "$lib/store/calendar";
  import CalendarViewToggle from "$lib/components/calendar/CalendarViewToggle.svelte";
  import CalendarMonthView from "$lib/components/calendar/CalendarMonthView.svelte";
  import CalendarWeekView from "$lib/components/calendar/CalendarWeekView.svelte";
  import EventModal from "$lib/components/calendar/EventModal.svelte";
  import DeleteEventModal from "$lib/components/calendar/DeleteEventModal.svelte";
  import EventsList from "$lib/components/calendar/EventsList.svelte";
  import type { CalendarEvent } from "$lib/types";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let form: any = {};

  // Initialize view and date from URL parameters or defaults
  let selectedDate: CalendarDate;
  let initialized = false;
  
  // Initialize from URL parameters on mount
  onMount(() => {
    const urlView = $page.url.searchParams.get("view") as "month" | "week" | null;
    const urlDate = $page.url.searchParams.get("date");
    
    // Set view from URL or default to month
    const view = urlView || "month";
    calendarView.set(view);
    
    // Set date from URL or default to today
    if (urlDate) {
      try {
        const [year, month, day] = urlDate.split('-').map(Number);
        selectedDate = new CalendarDate(year, month, day);
        currentCalendarDate.set(urlDate);
      } catch {
        selectedDate = today(getLocalTimeZone());
        currentCalendarDate.set(formatDateForURL(selectedDate));
      }
    } else {
      selectedDate = today(getLocalTimeZone());
      currentCalendarDate.set(formatDateForURL(selectedDate));
    }
    
    initialized = true;
  });

  // Always update store when data changes
  $: if (data.events) {
    setCalendarEventsData({
      events: data.events,
      pagination: data.pagination,
      filters: data.filters,
    });
  }

  // Events from store (reactive to server updates)
  $: events = $calendarEvents;

  function formatDateForURL(date: CalendarDate): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  function updateURL(view?: "month" | "week", date?: CalendarDate) {
    if (!initialized) return; // Don't update URL during initialization
    
    const url = new URL($page.url);
    
    if (view) {
      url.searchParams.set("view", view);
    }
    
    if (date) {
      url.searchParams.set("date", formatDateForURL(date));
    }
    
    goto(url.toString(), { replaceState: true, noScroll: true });
  }

  function handleDateSelect(event: CustomEvent<{ date: any; events: CalendarEvent[] }>) {
    selectedDate = event.detail.date;
    currentCalendarDate.set(formatDateForURL(selectedDate));
    updateURL(undefined, selectedDate);
  }

  function handleWeekChange(event: CustomEvent<any>) {
    selectedDate = event.detail;
    currentCalendarDate.set(formatDateForURL(selectedDate));
    updateURL(undefined, selectedDate);
  }

  function handleViewChange(newView: "month" | "week") {
    calendarView.set(newView);
    updateURL(newView, selectedDate);
  }

  async function handleEventSuccess() {
    // Immediately update the local store to remove the deleted event
    if ($eventToDelete) {
      removeEventFromStore($eventToDelete.id);
    }
    
    // Also refresh data from server to ensure consistency
    await invalidateAll();
  }

  // Filter events for current view - only if initialized
  $: filteredEvents = initialized && selectedDate ? events.filter(event => {
    if ($calendarView === "month") {
      // Show events for the current month
      const eventDate = new Date(event.start_date);
      return eventDate.getMonth() === selectedDate.month - 1 && 
             eventDate.getFullYear() === selectedDate.year;
    } else {
      // Show events for the current week
      const eventDate = new Date(event.start_date);
      const weekStart = selectedDate.toDate(getLocalTimeZone());
      const dayOfWeek = weekStart.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + mondayOffset);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return eventDate >= weekStart && eventDate <= weekEnd;
    }
  }) : [];
</script>

{#if initialized}
<div class="container mx-auto p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold">Calendar</h1>
    <CalendarViewToggle on:viewChange={(e) => handleViewChange(e.detail)} />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Calendar View -->
    <div class="lg:col-span-2">
      {#if $calendarView === "month"}
        <CalendarMonthView 
          events={filteredEvents}
          bind:selectedDate
          on:dateSelect={handleDateSelect}
        />
      {:else}
        <CalendarWeekView 
          events={filteredEvents}
          bind:selectedDate
          on:weekChange={handleWeekChange}
        />
      {/if}
    </div>

    <!-- Events List Sidebar -->
    <div class="lg:col-span-1">
      <EventsList 
        events={filteredEvents}
        title={$calendarView === "month" ? "This Month" : "This Week"}
      />
    </div>
  </div>

  <!-- Event Modal -->
  <EventModal
    bind:open={$eventModalOpen}
    mode={$eventModalMode}
    event={$selectedEvent}
    selectedDate={$selectedDateForEvent}
    selectedTime={$selectedTimeForEvent}
    form={form}
    on:success={handleEventSuccess}
    on:close={closeEventModal}
  />

  <!-- Delete Event Modal -->
  <DeleteEventModal
    bind:open={$deleteModalOpen}
    event={$eventToDelete}
    on:success={handleEventSuccess}
    on:close={closeDeleteModal}
  />
</div>
{/if}