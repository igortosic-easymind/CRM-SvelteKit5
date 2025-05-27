import { writable, derived } from "svelte/store";
import type { Client, LeadStatus, PaginationState } from "$lib/types";

// Base writable stores
export const clients = writable<Client[]>([]);
export const pagination = writable<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
export const filters = writable<{
  search: string;
  lead: LeadStatus | null;
}>({
  search: "",
  lead: null,
});

// Loading and error states
export const loading = writable(false);
export const error = writable<string | null>(null);

// Derived store for filtered clients
export const filteredClients = derived([clients, filters], ([$clients, $filters]) => {
  // If no filters are applied, return all clients
  if (!$filters.search && !$filters.lead) {
    return $clients;
  }

  // Apply filters
  return $clients.filter((client) => {
    // Filter by lead status
    if ($filters.lead && client.lead !== $filters.lead) {
      return false;
    }

    // Filter by search term
    if ($filters.search) {
      const term = $filters.search.toLowerCase();
      return (
        client.company_name?.toLowerCase().includes(term) ||
        client.first_name.toLowerCase().includes(term) ||
        client.last_name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term)
      );
    }

    return true;
  });
});

// Simple action to set clients data
export function setClientsData(data: {
  clients: Client[];
  pagination: PaginationState;
  filters?: { search?: string; lead?: LeadStatus | null };
}) {
  clients.set(data.clients);
  pagination.set(data.pagination);

  if (data.filters) {
    filters.update((currentFilters) => ({
      ...currentFilters,
      search: data.filters?.search || "",
      lead: data.filters?.lead || null,
    }));
  }
}

// Action to update filters
export function updateFilters(newFilters: { search?: string; lead?: LeadStatus | null }) {
  filters.update((f) => ({ ...f, ...newFilters }));
}

// Action to reset filters
export function resetFilters() {
  filters.set({ search: "", lead: null });
}

// Action to set loading state
export function setLoading(isLoading: boolean) {
  loading.set(isLoading);
}

// Action to set error state
export function setError(errorMessage: string | null) {
  error.set(errorMessage);
}
