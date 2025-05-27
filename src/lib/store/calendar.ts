// src/lib/store/calendar.ts
import { writable, derived } from "svelte/store";
import type { CalendarEvent, CalendarEventType, CalendarEventStatus, PaginationState } from "$lib/types";

// Base writable stores
export const calendarEvents = writable<CalendarEvent[]>([]);
export const calendarPagination = writable<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
export const calendarFilters = writable<{
  search: string;
  type: CalendarEventType | null;
  status: CalendarEventStatus | null;
  client_id: number | null;
  start_date: string | null;
  end_date: string | null;
}>({
  search: "",
  type: null,
  status: null,
  client_id: null,
  start_date: null,
  end_date: null,
});

// Loading and error states
export const calendarLoading = writable(false);
export const calendarError = writable<string | null>(null);

// UI action states
export const eventModalOpen = writable(false);
export const eventModalMode = writable<"create" | "edit" | "view">("create");
export const selectedEvent = writable<CalendarEvent | null>(null);
export const selectedDateForEvent = writable<string | null>(null);
export const selectedTimeForEvent = writable<string | null>(null);

// Delete modal states
export const deleteModalOpen = writable(false);
export const eventToDelete = writable<CalendarEvent | null>(null);

// Calendar view state - now with persistence
export const calendarView = writable<"month" | "week">("month");
export const currentCalendarDate = writable<string | null>(null); // ISO date string (YYYY-MM-DD)

// Derived store for filtered calendar events
export const filteredCalendarEvents = derived(
  [calendarEvents, calendarFilters],
  ([$calendarEvents, $calendarFilters]) => {
    // If no filters are applied, return all events
    if (!$calendarFilters.search && !$calendarFilters.type && !$calendarFilters.status && !$calendarFilters.client_id) {
      return $calendarEvents;
    }

    // Apply filters
    return $calendarEvents.filter((event) => {
      // Filter by type
      if ($calendarFilters.type && event.type !== $calendarFilters.type) {
        return false;
      }

      // Filter by status
      if ($calendarFilters.status && event.status !== $calendarFilters.status) {
        return false;
      }

      // Filter by client_id
      if ($calendarFilters.client_id && event.client_id !== $calendarFilters.client_id) {
        return false;
      }

      // Filter by search term
      if ($calendarFilters.search) {
        const term = $calendarFilters.search.toLowerCase();
        return (
          event.title.toLowerCase().includes(term) ||
          (event.description && event.description.toLowerCase().includes(term))
        );
      }

      return true;
    });
  },
);

// Simple action to set calendar events data
export function setCalendarEventsData(data: {
  events: CalendarEvent[];
  pagination: PaginationState;
  filters?: {
    search?: string;
    type?: CalendarEventType | null;
    status?: CalendarEventStatus | null;
    client_id?: number | null;
    start_date?: string | null;
    end_date?: string | null;
  };
}) {
  calendarEvents.set(data.events);
  calendarPagination.set(data.pagination);

  if (data.filters) {
    calendarFilters.update((currentFilters) => ({
      ...currentFilters,
      search: data.filters?.search || "",
      type: data.filters?.type || null,
      status: data.filters?.status || null,
      client_id: data.filters?.client_id || null,
      start_date: data.filters?.start_date || null,
      end_date: data.filters?.end_date || null,
    }));
  }
}

// Action to update filters
export function updateCalendarFilters(newFilters: {
  search?: string;
  type?: CalendarEventType | null;
  status?: CalendarEventStatus | null;
  client_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}) {
  calendarFilters.update((f) => ({ ...f, ...newFilters }));
}

// Action to reset filters
export function resetCalendarFilters() {
  calendarFilters.set({
    search: "",
    type: null,
    status: null,
    client_id: null,
    start_date: null,
    end_date: null,
  });
}

// Action to set loading state
export function setCalendarLoading(isLoading: boolean) {
  calendarLoading.set(isLoading);
}

// Action to set error state
export function setCalendarError(errorMessage: string | null) {
  calendarError.set(errorMessage);
}

// UI Action functions
export function viewEvent(event: CalendarEvent) {
  selectedEvent.set(event);
  eventModalMode.set("view");
  eventModalOpen.set(true);
}

export function editEvent(event: CalendarEvent) {
  selectedEvent.set(event);
  eventModalMode.set("edit");
  eventModalOpen.set(true);
}

export function createEvent(date?: string, time?: string) {
  selectedEvent.set(null);
  selectedDateForEvent.set(date || null);
  selectedTimeForEvent.set(time || null);
  eventModalMode.set("create");
  eventModalOpen.set(true);
}

export function deleteEvent(event: CalendarEvent) {
  eventToDelete.set(event);
  deleteModalOpen.set(true);
}

export function closeEventModal() {
  eventModalOpen.set(false);
  selectedEvent.set(null);
  selectedDateForEvent.set(null);
  selectedTimeForEvent.set(null);
}

export function closeDeleteModal() {
  deleteModalOpen.set(false);
  eventToDelete.set(null);
}

// Calendar view actions
export function setCalendarView(view: "month" | "week") {
  calendarView.set(view);
}

export function setCurrentCalendarDate(date: string | null) {
  currentCalendarDate.set(date);
}

export function setCalendarViewAndDate(view: "month" | "week", date: string | null) {
  calendarView.set(view);
  currentCalendarDate.set(date);
}

// Helper function to remove an event from the store (for optimistic updates)
export function removeEventFromStore(eventId: number) {
  calendarEvents.update((events) => events.filter((event) => event.id !== eventId));
}
