<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { getLocalTimeZone, today, CalendarDate } from "@internationalized/date";
  import { viewEvent, createEvent } from "$lib/store/calendar";
  import type { CalendarEvent } from "$lib/types";

  export let events: CalendarEvent[] = [];
  export let selectedDate: CalendarDate = today(getLocalTimeZone());

  const dispatch = createEventDispatcher<{
    weekChange: CalendarDate;
  }>();

  // Time slots from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    return {
      hour,
      label: `${hour}:00`,
      value: `${hour.toString().padStart(2, '0')}:00`
    };
  });

  // Get the week dates starting from Monday
  $: weekDates = getWeekDates(selectedDate);

  // Group events by date and time
  $: eventsByDateTime = events.reduce((acc, event) => {
    const eventDate = new Date(event.start_date);
    const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
    const hour = eventDate.getHours();
    const key = `${dateKey}-${hour}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  function getWeekDates(date: CalendarDate): CalendarDate[] {
    const dates: CalendarDate[] = [];
    const jsDate = date.toDate(getLocalTimeZone());
    const dayOfWeek = jsDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Calculate days to Monday
    const startOfWeek = date.add({ days: mondayOffset });
    
    for (let i = 0; i < 7; i++) {
      dates.push(startOfWeek.add({ days: i }));
    }
    
    return dates;
  }

  function formatDate(date: CalendarDate): string {
    return date.toDate(getLocalTimeZone()).toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  function getDateKey(date: CalendarDate): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  function handleTimeSlotClick(date: CalendarDate, timeSlot: { hour: number; label: string; value: string }) {
    const dateKey = getDateKey(date);
    createEvent(dateKey, timeSlot.value);
  }

  function handleEventClick(event: CalendarEvent) {
    viewEvent(event);
  }

  function navigateWeek(direction: 'prev' | 'next') {
    const newDate = direction === 'prev' 
      ? selectedDate.subtract({ weeks: 1 })
      : selectedDate.add({ weeks: 1 });
    selectedDate = newDate;
    dispatch("weekChange", newDate);
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

  function formatEventTime(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return `${startTime} - ${endTime}`;
  }
</script>

<div class="calendar-week-view">
  <!-- Week Navigation -->
  <div class="flex items-center justify-between mb-4">
    <Button variant="outline" size="sm" onclick={() => navigateWeek('prev')}>
      ← Previous Week
    </Button>
    
    <h2 class="text-lg font-semibold">
      {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
    </h2>
    
    <Button variant="outline" size="sm" onclick={() => navigateWeek('next')}>
      Next Week →
    </Button>
  </div>

  <!-- Week Grid -->
  <div class="grid grid-cols-8 gap-1 border rounded-lg overflow-hidden">
    <!-- Header Row -->
    <div class="bg-gray-50 p-2 text-sm font-medium border-r">Time</div>
    {#each weekDates as date}
      <div class="bg-gray-50 p-2 text-sm font-medium text-center border-r last:border-r-0">
        <div>{formatDate(date)}</div>
        <div class="text-xs text-gray-500">{date.day}</div>
      </div>
    {/each}

    <!-- Time Slots -->
    {#each timeSlots as timeSlot}
      <!-- Time Label -->
      <div class="bg-gray-50 p-2 text-sm border-r border-b text-right">
        {timeSlot.label}
      </div>
      
      <!-- Day Columns -->
      {#each weekDates as date}
        <div class="relative min-h-[60px] border-r border-b last:border-r-0 hover:bg-gray-50 transition-colors">
          <!-- Time Slot Click Area -->
          <button
            class="absolute inset-0 w-full h-full opacity-0 hover:opacity-10 bg-blue-500 transition-opacity"
            onclick={() => handleTimeSlotClick(date, timeSlot)}
            aria-label="Add event at {timeSlot.label} on {formatDate(date)}"
          ></button>
          
          <!-- Events in this time slot -->
          {#if eventsByDateTime[`${getDateKey(date)}-${timeSlot.hour}`]}
            <div class="p-1 space-y-1">
              {#each eventsByDateTime[`${getDateKey(date)}-${timeSlot.hour}`] as event}
                <button
                  class="w-full text-left text-xs p-1 rounded {getEventTypeColor(event.type)} text-white hover:opacity-80 transition-opacity"
                  onclick={() => handleEventClick(event)}
                  title="{event.title} - {formatEventTime(event.start_date, event.end_date)}"
                >
                  <div class="font-medium truncate">{event.title}</div>
                  {#if event.location}
                    <div class="truncate opacity-75">{event.location}</div>
                  {/if}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    {/each}
  </div>

  <!-- Legend -->
  <div class="mt-4 flex flex-wrap gap-4 text-sm">
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded bg-blue-500"></div>
      <span>Meeting</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded bg-green-500"></div>
      <span>Call</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded bg-yellow-500"></div>
      <span>Follow-up</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded bg-red-500"></div>
      <span>Deadline</span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="w-3 h-3 rounded bg-purple-500"></div>
      <span>Personal</span>
    </div>
  </div>
</div> 