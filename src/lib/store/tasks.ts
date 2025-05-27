import { writable, derived } from "svelte/store";
import type { Task, TaskStatus, PaginationState } from "$lib/types";

// Base writable stores
export const tasks = writable<Task[]>([]);
export const tasksPagination = writable<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
export const tasksFilters = writable<{
  search: string;
  status: TaskStatus | null;
  client_id: number | null;
}>({
  search: "",
  status: null,
  client_id: null,
});

// Loading and error states
export const tasksLoading = writable(false);
export const tasksError = writable<string | null>(null);

// Derived store for filtered tasks
export const filteredTasks = derived([tasks, tasksFilters], ([$tasks, $tasksFilters]) => {
  // If no filters are applied, return all tasks
  if (!$tasksFilters.search && !$tasksFilters.status && !$tasksFilters.client_id) {
    return $tasks;
  }

  // Apply filters
  return $tasks.filter((task) => {
    // Filter by status
    if ($tasksFilters.status && task.status !== $tasksFilters.status) {
      return false;
    }

    // Filter by client_id
    if ($tasksFilters.client_id && task.client_id !== $tasksFilters.client_id) {
      return false;
    }

    // Filter by search term
    if ($tasksFilters.search) {
      const term = $tasksFilters.search.toLowerCase();
      return task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term);
    }

    return true;
  });
});

// Simple action to set tasks data
export function setTasksData(data: {
  tasks: Task[];
  pagination: PaginationState;
  filters?: { search?: string; status?: TaskStatus | null; client_id?: number | null };
}) {
  tasks.set(data.tasks);
  tasksPagination.set(data.pagination);

  if (data.filters) {
    tasksFilters.update((currentFilters) => ({
      ...currentFilters,
      search: data.filters?.search || "",
      status: data.filters?.status || null,
      client_id: data.filters?.client_id || null,
    }));
  }
}

// Action to update filters
export function updateTasksFilters(newFilters: {
  search?: string;
  status?: TaskStatus | null;
  client_id?: number | null;
}) {
  tasksFilters.update((f) => ({ ...f, ...newFilters }));
}

// Action to reset filters
export function resetTasksFilters() {
  tasksFilters.set({ search: "", status: null, client_id: null });
}

// Action to set loading state
export function setTasksLoading(isLoading: boolean) {
  tasksLoading.set(isLoading);
}

// Action to set error state
export function setTasksError(errorMessage: string | null) {
  tasksError.set(errorMessage);
}
