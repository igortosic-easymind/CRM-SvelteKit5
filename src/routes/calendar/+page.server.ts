// src/routes/calendar/+page.server.ts
import {
  listCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "$lib/server/calendar";
import type { PageServerLoad, Actions } from "./$types";
import type {
  CalendarEvent,
  CalendarEventType,
  CalendarEventStatus,
  PaginationState,
  CreateCalendarEventData,
} from "$lib/types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, url }) => {
  // Get query parameters
  const page = Number(url.searchParams.get("page") || "1");
  const search = url.searchParams.get("search") || "";
  const typeParam = url.searchParams.get("type");
  const type = typeParam ? (typeParam as CalendarEventType) : undefined;
  const statusParam = url.searchParams.get("status");
  const status = statusParam ? (statusParam as CalendarEventStatus) : undefined;
  const client_id = Number(url.searchParams.get("client_id")) || undefined;
  const start_date = url.searchParams.get("start_date") || undefined;
  const end_date = url.searchParams.get("end_date") || undefined;

  // Get view and date parameters for calendar state
  const view = url.searchParams.get("view") as "month" | "week" | null;
  const date = url.searchParams.get("date") || undefined;

  // Fetch data with filters
  const calendarResponse = await listCalendarEvents(cookies, {
    page,
    itemsPerPage: 50, // Increase to see more events
    search,
    type,
    client_id,
    start_date,
    end_date,
  });

  return {
    events: calendarResponse.data as CalendarEvent[],
    pagination: calendarResponse.pagination as PaginationState,
    filters: {
      search,
      type,
      status,
      client_id,
      start_date,
      end_date,
    },
    // Add view state to the returned data
    viewState: {
      view: view || "month",
      date: date || null,
    },
  };
};

export const actions: Actions = {
  create: async ({ request, cookies }) => {
    const formData = await request.formData();

    // Helper function to convert datetime-local to ISO string
    function formatDateTimeForAPI(dateTimeLocal: string): string {
      if (!dateTimeLocal) return "";
      // datetime-local gives us "2025-05-28T00:00", we need to add timezone
      const date = new Date(dateTimeLocal);
      return date.toISOString(); // This gives us "2025-05-28T00:00:00.000Z"
    }

    const eventData: CreateCalendarEventData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      start_date: formatDateTimeForAPI(formData.get("start_date")?.toString() || ""),
      end_date: formatDateTimeForAPI(formData.get("end_date")?.toString() || ""),
      all_day: formData.get("all_day") === "on", // Fix: checkbox sends "on" when checked, not "true"
      type: (formData.get("type")?.toString() as CalendarEventType) || "meeting",
      status: (formData.get("status")?.toString() as CalendarEventStatus) || "scheduled",
      location: formData.get("location")?.toString() || "",
      recurrence:
        (formData.get("recurrence")?.toString() as "none" | "daily" | "weekly" | "monthly" | "yearly") || "none",
      client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
      task_id: formData.get("task_id") ? Number(formData.get("task_id")) : undefined,
      recurrence_end: formData.get("recurrence_end")?.toString() || undefined,
    };

    const result = await createCalendarEvent(cookies, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }
    return { success: true, event: result.data };
  },

  update: async ({ request, cookies }) => {
    const formData = await request.formData();
    const eventId = formData.get("id")?.toString();

    if (!eventId) {
      return fail(400, { error: "Event ID is required" });
    }

    // Helper function to convert datetime-local to ISO string
    function formatDateTimeForAPI(dateTimeLocal: string): string {
      if (!dateTimeLocal) return "";
      // datetime-local gives us "2025-05-28T00:00", we need to add timezone
      const date = new Date(dateTimeLocal);
      return date.toISOString(); // This gives us "2025-05-28T00:00:00.000Z"
    }

    const eventData = {
      id: Number(eventId),
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      start_date: formatDateTimeForAPI(formData.get("start_date")?.toString() || ""),
      end_date: formatDateTimeForAPI(formData.get("end_date")?.toString() || ""),
      all_day: formData.get("all_day") === "on", // Fix: checkbox sends "on" when checked, not "true"
      type: (formData.get("type")?.toString() as CalendarEventType) || "meeting",
      status: (formData.get("status")?.toString() as CalendarEventStatus) || "scheduled",
      location: formData.get("location")?.toString() || "",
      recurrence:
        (formData.get("recurrence")?.toString() as "none" | "daily" | "weekly" | "monthly" | "yearly") || "none",
      client_id: formData.get("client_id") ? Number(formData.get("client_id")) : undefined,
      task_id: formData.get("task_id") ? Number(formData.get("task_id")) : undefined,
      recurrence_end: formData.get("recurrence_end")?.toString() || undefined,
    };

    const result = await updateCalendarEvent(cookies, eventId, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true, event: result.data };
  },

  delete: async ({ request, cookies }) => {
    const formData = await request.formData();
    const eventId = formData.get("id")?.toString();

    if (!eventId) {
      return fail(400, { error: "Event ID is required" });
    }

    const result = await deleteCalendarEvent(cookies, Number(eventId));

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true };
  },
};
