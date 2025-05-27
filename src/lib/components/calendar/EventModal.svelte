<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { enhance } from "$app/forms";
  import { deleteEvent } from "$lib/store/calendar";
  import type { CalendarEvent, CalendarEventType, CalendarEventStatus } from "$lib/types";

  export let open = false;
  export let mode: "create" | "edit" | "view" = "create";
  export let event: CalendarEvent | null = null;
  export let selectedDate: string | null = null; // ISO date string
  export let selectedTime: string | null = null; // HH:MM format
  export let form: any = {};

  const dispatch = createEventDispatcher<{
    close: void;
    success: void;
  }>();

  let isSubmitting = false;

  // Event types and statuses for dropdowns
  const eventTypes: { value: CalendarEventType; label: string }[] = [
    { value: "meeting", label: "Meeting" },
    { value: "call", label: "Call" },
    { value: "follow-up", label: "Follow-up" },
    { value: "deadline", label: "Deadline" },
    { value: "personal", label: "Personal" },
    { value: "other", label: "Other" }
  ];

  const eventStatuses: { value: CalendarEventStatus; label: string }[] = [
    { value: "scheduled", label: "Scheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "rescheduled", label: "Rescheduled" }
  ];

  // Initialize form data when modal opens
  let defaultStartDate = "";
  let defaultEndDate = "";

  // Initialize form data when modal opens
  $: if (open) {
    initializeFormData();
  }
  
  // Reinitialize when selectedDate or selectedTime changes while modal is open
  $: if (open && mode === "create") {
    // This will trigger when selectedDate or selectedTime change
    selectedDate, selectedTime;
    initializeFormData();
  }

  function initializeFormData() {
    if (mode === "edit" && event) {
      defaultStartDate = formatDateTimeLocal(event.start_date);
      defaultEndDate = formatDateTimeLocal(event.end_date);
    } else {
      // Create mode - initialize with selected date/time
      const now = new Date();
      let startDate: Date;
      
      if (selectedDate) {
        // Parse the date string properly to avoid timezone issues
        const [year, month, day] = selectedDate.split('-').map(Number);
        startDate = new Date(year, month - 1, day); // month is 0-indexed
        
        if (selectedTime) {
          // Set the specific time
          const [hours, minutes] = selectedTime.split(':').map(Number);
          startDate.setHours(hours, minutes, 0, 0);
        } else {
          // If no time specified, use current time
          startDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
        }
      } else {
        // No date specified, use current date and time
        startDate = now;
      }
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1); // Default 1 hour duration

      defaultStartDate = formatDateTimeLocal(startDate.toISOString());
      defaultEndDate = formatDateTimeLocal(endDate.toISOString());
    }
  }

  function handleClose() {
    dispatch("close");
  }

  // Format datetime for input fields
  function formatDateTimeLocal(isoString: string): string {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Get local date components to avoid timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Form enhancement
  function handleSubmit() {
    isSubmitting = true;
    
    return async ({ update, result }: { update: () => Promise<void>; result: any }) => {
      await update();
      isSubmitting = false;
    
      
      if (result.type === 'success') {
        dispatch("success");
        handleClose();
      } else if (result.type === 'failure') {
        console.error('Form submission failed:', result.data);
      }
    };
  }

  function handleDelete() {
    if (event) {
      deleteEvent(event);
      handleClose();
    }
  }
</script>

<Dialog bind:open onOpenChange={handleClose}>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle>
        {mode === "create" ? "Create Event" : mode === "edit" ? "Edit Event" : "Event Details"}
      </DialogTitle>
    </DialogHeader>

    <form 
      method="POST" 
      action={mode === "create" ? "?/create" : "?/update"}
      use:enhance={handleSubmit}
      class="space-y-4"
    >
      {#if form?.error}
        <div class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {form.error}
        </div>
      {/if}

      <!-- Hidden ID field for edit mode -->
      {#if mode === "edit" && event}
        <input type="hidden" name="id" value={event.id} />
      {/if}

      <!-- Title -->
      <div class="space-y-2">
        <Label for="title">Title *</Label>
        <Input
          id="title"
          name="title"
          value={event?.title || ""}
          placeholder="Event title"
          disabled={mode === "view"}
          required
        />
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <Label for="description">Description</Label>
        <textarea
          id="description"
          name="description"
          placeholder="Event description"
          disabled={mode === "view"}
          class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >{event?.description || ""}</textarea>
      </div>

      <!-- Start Date/Time -->
      <div class="space-y-2">
        <Label for="start_date">Start Date & Time *</Label>
        <Input
          id="start_date"
          name="start_date"
          type="datetime-local"
          value={defaultStartDate}
          disabled={mode === "view"}
          required
        />
      </div>

      <!-- End Date/Time -->
      <div class="space-y-2">
        <Label for="end_date">End Date & Time *</Label>
        <Input
          id="end_date"
          name="end_date"
          type="datetime-local"
          value={defaultEndDate}
          disabled={mode === "view"}
          required
        />
      </div>

      <!-- All Day Toggle -->
      <div class="flex items-center space-x-2">
        <input
          id="all_day"
          name="all_day"
          type="checkbox"
          value="true"
          checked={event?.all_day || false}
          disabled={mode === "view"}
          class="h-4 w-4 rounded border-gray-300"
        />
        <Label for="all_day">All day event</Label>
      </div>

      <!-- Type -->
      <div class="space-y-2">
        <Label for="type">Type</Label>
        <select
          id="type"
          name="type"
          disabled={mode === "view"}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each eventTypes as eventType}
            <option value={eventType.value} selected={event?.type === eventType.value}>
              {eventType.label}
            </option>
          {/each}
        </select>
      </div>

      <!-- Status -->
      <div class="space-y-2">
        <Label for="status">Status</Label>
        <select
          id="status"
          name="status"
          disabled={mode === "view"}
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {#each eventStatuses as eventStatus}
            <option value={eventStatus.value} selected={event?.status === eventStatus.value}>
              {eventStatus.label}
            </option>
          {/each}
        </select>
      </div>

      <!-- Location -->
      <div class="space-y-2">
        <Label for="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={event?.location || ""}
          placeholder="Event location"
          disabled={mode === "view"}
        />
      </div>

      <!-- Recurrence -->
      <input type="hidden" name="recurrence" value="none" />

      <DialogFooter>
        {#if mode === "view"}
          <Button type="button" variant="outline" onclick={handleClose}>Close</Button>
          <Button type="button" onclick={() => mode = "edit"}>Edit</Button>
        {:else}
          <Button type="button" variant="outline" onclick={handleClose}>Cancel</Button>
          {#if mode === "edit"}
            <Button type="button" variant="destructive" onclick={handleDelete}>
              Delete
            </Button>
          {/if}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </Button>
        {/if}
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog> 