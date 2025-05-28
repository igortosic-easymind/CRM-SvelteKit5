# State Management Architecture

## Table of Contents

1. [Overview](#overview)
2. [Core State Management](#core-state-management)
3. [Data Flow Architecture](#data-flow-architecture)
4. [State Patterns](#state-patterns)
5. [Component Communication](#component-communication)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [Future Improvements](#future-improvements)

## Overview

Our CRM system implements a **hybrid state management approach** combining Svelte stores for client-side state management and SvelteKit form actions for server-side data handling. This architecture provides an optimal balance between simplicity, performance, and developer experience.

### Key Business Requirements

- **Real-time UI updates** for sales team efficiency
- **Complex filtering and sorting** for large client datasets
- **Modal state management** for create/edit/view operations
- **Optimistic updates** for better user experience
- **Cross-entity state management** (clients, tasks, calendar events)
- **Form validation and error handling** with user feedback

### Architecture Benefits

- **Reactive by design** - Svelte's reactivity handles UI updates automatically
- **Type-safe** - Full TypeScript integration across stores and components
- **Server-first** - Leverages SvelteKit's server-side capabilities
- **Progressive enhancement** - Works without JavaScript
- **Minimal boilerplate** - Less code compared to Redux-style solutions

## Core State Management

### Why Svelte Stores?

We chose Svelte stores for client-side state management based on several factors:

1. **Native Reactivity**

   - Built-in reactive updates without manual subscriptions
   - Automatic component re-rendering when state changes
   - Derived stores for computed values

2. **Simplicity**

   - Minimal API surface area
   - No complex middleware or setup required
   - Easy to understand and maintain

3. **Performance**

   - Fine-grained reactivity updates only what changed
   - No virtual DOM overhead
   - Efficient memory usage

4. **TypeScript Integration**
   - Full type safety across the application
   - IntelliSense support for store values
   - Compile-time error checking

### Store Structure

```
src/lib/store/
├── calendar.ts    // Calendar events & UI state
├── clients.ts     // Client data & filters
└── tasks.ts       // Task management & filters
```

Each store follows a consistent pattern with:

- **Data stores** - Core entity data (clients, tasks, events)
- **Filter stores** - Search and filtering state
- **Pagination stores** - Page navigation state
- **UI stores** - Modal states, loading states, errors
- **Derived stores** - Computed values (filtered data)
- **Action functions** - State update operations

## Data Flow Architecture

### Server-Side Data Handling

SvelteKit form actions handle all server communications:

```typescript
// Example: Calendar event creation
export const actions: Actions = {
  create: async ({ request, cookies }) => {
    const formData = await request.formData();

    const eventData: CreateCalendarEventData = {
      title: formData.get("title")?.toString() || "",
      start_date: formatDateTimeForAPI(formData.get("start_date")?.toString() || ""),
      // ... other fields
    };

    const result = await createCalendarEvent(cookies, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true, event: result.data };
  },
};
```

**Benefits:**

- Type-safe server communication
- Centralized error handling
- Consistent response format
- Built-in CSRF protection
- Progressive enhancement support

### Client-Side State Updates

Stores are updated through dedicated action functions:

```typescript
// Calendar store actions
export function setCalendarEventsData(data: {
  events: CalendarEvent[];
  pagination: PaginationState;
  filters?: FilterState;
}) {
  calendarEvents.set(data.events);
  calendarPagination.set(data.pagination);

  if (data.filters) {
    calendarFilters.update((currentFilters) => ({
      ...currentFilters,
      ...data.filters,
    }));
  }
}
```

## State Patterns

### Common State Interfaces

All entity stores follow consistent patterns:

```typescript
// Loading State Pattern
interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

// Pagination State Pattern
interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Filter State Pattern
interface FilterState {
  search: string;
  status?: string | null;
  client_id?: number | null;
  start_date?: string | null;
  end_date?: string | null;
}
```

### Store Pattern Implementation

```typescript
// Base writable stores
export const calendarEvents = writable<CalendarEvent[]>([]);
export const calendarPagination = writable<PaginationState>({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});
export const calendarFilters = writable<FilterState>({
  search: "",
  type: null,
  status: null,
  client_id: null,
});

// Loading and error states
export const calendarLoading = writable(false);
export const calendarError = writable<string | null>(null);

// UI state for modals
export const eventModalOpen = writable(false);
export const eventModalMode = writable<"create" | "edit" | "view">("create");
export const selectedEvent = writable<CalendarEvent | null>(null);

// Derived store for computed values
export const filteredCalendarEvents = derived([calendarEvents, calendarFilters], ([$events, $filters]) => {
  if (!$filters.search && !$filters.type && !$filters.status) {
    return $events;
  }

  return $events.filter((event) => {
    // Apply filtering logic
    if ($filters.type && event.type !== $filters.type) return false;
    if ($filters.search && !event.title.toLowerCase().includes($filters.search.toLowerCase())) return false;
    return true;
  });
});
```

## Component Communication

### Event Dispatchers

Components use `createEventDispatcher` for parent-child communication:

```typescript
// EventModal.svelte
const dispatch = createEventDispatcher<{
  close: void;
  success: void;
}>();

function handleClose() {
  dispatch("close");
}

function handleSubmit() {
  // Form submission logic
  if (success) {
    dispatch("success");
    handleClose();
  }
}
```

### Store Actions for Global Operations

Global UI actions are handled through store functions:

```typescript
// Calendar store actions
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
```

### Component Usage

```svelte
<!-- CalendarMonthView.svelte -->
<script lang="ts">
  import { viewEvent, editEvent, deleteEvent, createEvent } from "$lib/store/calendar";

  function handleEventView(event: CalendarEvent) {
    viewEvent(event);
  }

  function handleCreateEvent(date: CalendarDate) {
    const isoDate = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
    createEvent(isoDate);
  }
</script>

<!-- Event list with actions -->
{#each dayEvents as event}
  <div class="event-item">
    <span>{event.title}</span>
    <button on:click={() => handleEventView(event)}>View</button>
    <button on:click={() => editEvent(event)}>Edit</button>
    <button on:click={() => deleteEvent(event)}>Delete</button>
  </div>
{/each}
```

## Error Handling

### Server-Side Error Handling

Form actions return consistent error responses:

```typescript
export const actions: Actions = {
  create: async ({ request, cookies }) => {
    try {
      const result = await createCalendarEvent(cookies, eventData);

      if (!result.success) {
        return fail(400, { error: result.error });
      }

      return { success: true, event: result.data };
    } catch (error) {
      return fail(500, {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  },
};
```

### Client-Side Error Display

Components handle form errors through the `form` prop:

```svelte
<!-- EventModal.svelte -->
<script lang="ts">
  export let form: any = {};
</script>

<form method="POST" action="?/create" use:enhance={handleSubmit}>
  {#if form?.error}
    <div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      {form.error}
    </div>
  {/if}

  <!-- Form fields -->
</form>
```

### Store Error Management

```typescript
// Error state in stores
export const calendarError = writable<string | null>(null);

export function setCalendarError(errorMessage: string | null) {
  calendarError.set(errorMessage);
}

// Usage in components
$: if ($calendarError) {
  toast({
    variant: "destructive",
    title: "Error",
    description: $calendarError,
  });
}
```

## Best Practices

### State Updates

1. **Use action functions for state updates**

   ```typescript
   // Good
   updateCalendarFilters({ search: "meeting" });

   // Avoid direct store updates
   calendarFilters.update((f) => ({ ...f, search: "meeting" }));
   ```

2. **Batch related updates**

   ```typescript
   export function setCalendarEventsData(data: {
     events: CalendarEvent[];
     pagination: PaginationState;
     filters?: FilterState;
   }) {
     calendarEvents.set(data.events);
     calendarPagination.set(data.pagination);
     if (data.filters) {
       calendarFilters.update((current) => ({ ...current, ...data.filters }));
     }
   }
   ```

3. **Use derived stores for computed values**
   ```typescript
   export const filteredCalendarEvents = derived([calendarEvents, calendarFilters], ([$events, $filters]) => {
     return $events.filter((event) => {
       // Filtering logic
     });
   });
   ```

### Form Enhancement

1. **Always use progressive enhancement**

   ```svelte
   <form method="POST" use:enhance={handleSubmit}>
     <!-- Form works without JavaScript -->
   </form>
   ```

2. **Handle loading states**

   ```typescript
   function handleSubmit() {
     isSubmitting = true;

     return async ({ update, result }) => {
       await update();
       isSubmitting = false;

       if (result.type === "success") {
         dispatch("success");
       }
     };
   }
   ```

### Type Safety

1. **Define strict interfaces**

   ```typescript
   interface CalendarEvent {
     id: number;
     title: string;
     start_date: string;
     end_date: string;
     type: CalendarEventType;
     status: CalendarEventStatus;
   }
   ```

2. **Use typed event dispatchers**
   ```typescript
   const dispatch = createEventDispatcher<{
     close: void;
     success: { event: CalendarEvent };
   }>();
   ```

## Examples

### Complete Calendar Event Management Flow

```typescript
// 1. Store setup (calendar.ts)
export const calendarEvents = writable<CalendarEvent[]>([]);
export const eventModalOpen = writable(false);
export const selectedEvent = writable<CalendarEvent | null>(null);

export function createEvent(date?: string, time?: string) {
  selectedEvent.set(null);
  selectedDateForEvent.set(date || null);
  selectedTimeForEvent.set(time || null);
  eventModalMode.set("create");
  eventModalOpen.set(true);
}

// 2. Component usage (CalendarView.svelte)
<script lang="ts">
  import { calendarEvents, eventModalOpen, createEvent } from "$lib/store/calendar";

  function handleDateClick(date: string) {
    createEvent(date, "09:00");
  }
</script>

{#each $calendarEvents as event}
  <div class="event" on:click={() => viewEvent(event)}>
    {event.title}
  </div>
{/each}

<!-- Modal component -->
<EventModal
  bind:open={$eventModalOpen}
  on:success={() => {
    // Refresh events or handle optimistic update
  }}
/>

// 3. Server action (+page.server.ts)
export const actions: Actions = {
  create: async ({ request, cookies }) => {
    const formData = await request.formData();
    const eventData = extractEventData(formData);

    const result = await createCalendarEvent(cookies, eventData);

    if (!result.success) {
      return fail(400, { error: result.error });
    }

    return { success: true, event: result.data };
  }
};
```

### Filter Management Pattern

```typescript
// Store (clients.ts)
export const clientsFilters = writable<{
  search: string;
  lead: LeadStatus | null;
}>({
  search: "",
  lead: null,
});

export const filteredClients = derived(
  [clients, clientsFilters],
  ([$clients, $filters]) => {
    return $clients.filter(client => {
      if ($filters.lead && client.lead !== $filters.lead) return false;
      if ($filters.search) {
        const term = $filters.search.toLowerCase();
        return client.company_name?.toLowerCase().includes(term) ||
               client.first_name.toLowerCase().includes(term) ||
               client.last_name.toLowerCase().includes(term);
      }
      return true;
    });
  }
);

export function updateFilters(newFilters: Partial<typeof clientsFilters>) {
  clientsFilters.update(current => ({ ...current, ...newFilters }));
}

// Component usage
<script lang="ts">
  import { filteredClients, updateFilters } from "$lib/store/clients";

  let searchTerm = "";

  $: updateFilters({ search: searchTerm });
</script>

<input bind:value={searchTerm} placeholder="Search clients..." />

{#each $filteredClients as client}
  <ClientCard {client} />
{/each}
```

## Future Improvements

### Short Term

- **Optimistic updates** with rollback capability
- **Request deduplication** for concurrent operations
- **State persistence** for user preferences
- **Real-time updates** via WebSocket integration

### Medium Term

- **Advanced caching** strategies
- **Offline support** with sync capabilities
- **State normalization** for complex relationships
- **Performance monitoring** and optimization

### Long Term

- **State machine integration** for complex workflows
- **Advanced TypeScript** patterns for better DX
- **Micro-frontend** state sharing capabilities
- **AI-powered** state optimization

---

**Last Updated:** May 28, 2025  
**Architecture Version:** 1.0  
**SvelteKit Version:** 5.x
