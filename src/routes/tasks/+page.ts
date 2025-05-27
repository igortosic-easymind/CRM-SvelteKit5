import type { PageLoad } from "./$types";
import { setTasksData } from "$lib/store/tasks";
import { browser } from "$app/environment";

export const load: PageLoad = async ({ data, depends }) => {
  // Register a dependency to ensure the data is re-fetched when navigating
  depends("app:tasks");

  // If we're in the browser, update the store with the data from the server
  if (browser) {
    setTasksData({
      tasks: data.tasks,
      pagination: data.pagination,
      filters: data.filters,
    });
  }

  // Return the data as-is for the page component
  return data;
};
