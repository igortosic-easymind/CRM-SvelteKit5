// src/routes/calendar/+page.ts
import type { PageLoad } from "./$types";
import { setCalendarEventsData, setCalendarViewAndDate } from "$lib/store/calendar";
import { browser } from "$app/environment";

export const load: PageLoad = async ({ data, depends }) => {
  // Register a dependency to ensure the data is re-fetched when navigating
  depends("app:calendar");
  depends("calendar:events");

  // If we're in the browser, update the store with the data from the server
  if (browser) {
    setCalendarEventsData({
      events: data.events,
      pagination: data.pagination,
      filters: data.filters,
    });

    // Set the view state from URL parameters
    if (data.viewState) {
      setCalendarViewAndDate(data.viewState.view, data.viewState.date);
    }
  }

  // Return the data as-is for the page component
  return data;
};
