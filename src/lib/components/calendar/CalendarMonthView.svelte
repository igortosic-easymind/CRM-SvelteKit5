<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import Trash from "@lucide/svelte/icons/trash";
  import { viewEvent, editEvent, deleteEvent, createEvent } from "$lib/store/calendar";
  import type { CalendarEvent } from "$lib/types";

  export let events: CalendarEvent[] = [];
  export let selectedDate: CalendarDate = today(getLocalTimeZone());

  const dispatch = createEventDispatcher<{
    dateSelect: { date: CalendarDate; events: CalendarEvent[] };
  }>();

  // Group events by date for easy lookup
  $: eventsByDate = events.reduce((acc, event) => {
    const eventDate = new Date(event.start_date);
    const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  function handleDateSelect(date: CalendarDate | undefined) {
    if (date) {
      selectedDate = date;
      const dateKey = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      const dayEvents = eventsByDate[dateKey] || [];
      dispatch("dateSelect", { date, events: dayEvents });
    }
  }

  function handleEventView(event: CalendarEvent) {
    viewEvent(event);
  }

  function handleEventEdit(event: CalendarEvent) {
    editEvent(event);
  }

  function handleEventDelete(event: CalendarEvent) {
    deleteEvent(event);
  }

  function handleCreateEvent(date: CalendarDate) {
    const isoDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
    createEvent(isoDate);
  }

  function getEventTypeColor(type: string): string {
    const colors = {
      meeting: "bg-blue-500",
      call: "bg-green-500", 
      "follow-up": "bg-yellow-500",
      deadline: "bg-red-500",
      personal: "bg-purple-500",
      other: "bg-gray-500"
    };
    return colors[type as keyof typeof colors] || colors.other;
  }

  function formatEventTime(startDate: string, endDate: string, allDay: boolean): string {
    if (allDay) return "All day";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  }

  function getStatusColor(status: string): string {
    const colors = {
      scheduled: "text-blue-600",
      completed: "text-green-600",
      cancelled: "text-red-600",
      rescheduled: "text-yellow-600"
    };
    return colors[status as keyof typeof colors] || "text-gray-600";
  }
</script>

<div class="calendar-month-view">
  <!-- Calendar Navigation and Grid -->
  <div class="calendar-container">
    <Calendar
      type="single"
      bind:value={selectedDate}
      class="rounded-md border"
    />
  </div>

  <!-- Selected Date Info -->
  <div class="mt-4 p-4 bg-gray-50 rounded-lg">
    <h3 class="font-semibold mb-2">
      {selectedDate.toDate(getLocalTimeZone()).toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </h3>
    
    {#if eventsByDate[`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`]}
      <div class="space-y-2">
        {#each eventsByDate[`${selectedDate.year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`] as event}
          <div class="w-full p-2 rounded border hover:bg-gray-100 transition-colors">
            <div class="flex items-start space-x-2">
              <div class="w-3 h-3 rounded-full {getEventTypeColor(event.type)} mt-1 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="font-medium truncate">{event.title}</div>
                  <span class="text-xs {getStatusColor(event.status)} capitalize">
                    {event.status}
                  </span>
                </div>
                <div class="text-sm text-gray-600">
                  {formatEventTime(event.start_date, event.end_date, event.all_day)}
                </div>
                {#if event.location}
                  <div class="text-sm text-gray-500 truncate">{event.location}</div>
                {/if}
              </div>
              
              <!-- Action Buttons -->
              <div class="flex items-center space-x-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => handleEventView(event)}
                  title="View event"
                  class="h-7 w-7 p-0"
                >
                  <Eye class="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => handleEventEdit(event)}
                  title="Edit event"
                  class="h-7 w-7 p-0"
                >
                  <Edit class="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onclick={() => handleEventDelete(event)}
                  title="Delete event"
                  class="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash class="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-gray-500 text-sm">No events for this date</p>
    {/if}
    
    <Button
      class="mt-3 w-full"
      onclick={() => handleCreateEvent(selectedDate)}
    >
      Add Event
    </Button>
  </div>
</div>

<style>
  .calendar-month-view :global(.calendar) {
    width: 100%;
  }
  
  .calendar-month-view :global(.calendar-day) {
    height: 80px;
    vertical-align: top;
  }
  
  .calendar-month-view :global(.calendar-day:hover .add-event-btn) {
    opacity: 1;
  }
</style> 