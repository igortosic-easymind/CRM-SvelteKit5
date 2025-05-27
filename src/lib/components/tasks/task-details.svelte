<!-- src/lib/components/tasks/task-details.svelte -->
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Task } from "$lib/types";
  import { buttonVariants } from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils.js";
  import Edit from "@lucide/svelte/icons/edit";
  import Trash from "@lucide/svelte/icons/trash";
  import Calendar from "@lucide/svelte/icons/calendar";
  import User from "@lucide/svelte/icons/user";
  import DeleteTaskDialog from "./delete-task-dialog.svelte";
  
  // Props
  const { task } = $props<{ task: Task }>();
  
  // Function to format dates
  function formatDate(dateString: string | undefined) {
    if (!dateString) return "Not set";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      return "Invalid date";
    }
  }
  
  // Function to format datetime
  function formatDateTime(dateString: string | undefined) {
    if (!dateString) return "Not set";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Invalid date";
    }
  }
  
  // Function to get status class
  function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "todo": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
  
  // Function to get priority class
  function getPriorityClass(priority: string | undefined): string {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
  
  // Function to get type class
  function getTypeClass(type: string | undefined): string {
    switch (type?.toLowerCase()) {
      case "follow-up": return "bg-purple-100 text-purple-700";
      case "meeting": return "bg-green-100 text-green-700";
      case "call": return "bg-blue-100 text-blue-700";
      case "email": return "bg-yellow-100 text-yellow-700";
      case "other": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
</script>

<Card.Root class="max-w-4xl">
  <Card.Header class="flex flex-row items-center justify-between">
    <div>
      <Card.Title class="text-2xl">{task.title}</Card.Title>
      <Card.Description>
        <div class="flex items-center gap-2 mt-2">
          <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
          {#if task.priority}
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
              {task.priority} priority
            </span>
          {/if}
          {#if task.type}
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClass(task.type)}`}>
              {task.type}
            </span>
          {/if}
        </div>
      </Card.Description>
    </div>
    <div class="flex gap-2">
      <a 
        href={`/tasks/${task.id}/edit`} 
        class={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <Edit class="h-4 w-4 mr-2" />
        Edit
      </a>
    <DeleteTaskDialog task={task} />
    </div>
  </Card.Header>

  <Card.Content class="space-y-6">
    <!-- Task Information -->
    <div class="space-y-2">
      <h3 class="font-semibold text-lg">Task Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
        <div>
          <p class="text-sm text-muted-foreground">Status</p>
          <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Priority</p>
          {#if task.priority}
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
          {:else}
            <p>—</p>
          {/if}
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Type</p>
          {#if task.type}
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClass(task.type)}`}>
              {task.type}
            </span>
          {:else}
            <p>—</p>
          {/if}
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Due Date</p>
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4 text-muted-foreground" />
            <p>{formatDate(task.due_date)}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    {#if task.description}
      <div class="space-y-2">
        <h3 class="font-semibold text-lg">Description</h3>
        <div class="bg-muted/20 p-4 rounded-md">
          <p class="whitespace-pre-line">{task.description}</p>
        </div>
      </div>
    {/if}

    <!-- Client Information -->
    {#if task.client_id}
      <div class="space-y-2">
        <h3 class="font-semibold text-lg">Related Client</h3>
        <div class="bg-muted/20 p-4 rounded-md">
          <div class="flex items-center gap-2">
            <User class="h-4 w-4 text-muted-foreground" />
            <a 
              href={`/clients/${task.client_id}`} 
              class="text-blue-600 hover:underline font-medium"
            >
              View Client #{task.client_id}
            </a>
          </div>
        </div>
      </div>
    {/if}

    <!-- Timestamps -->
    <div class="space-y-2">
      <h3 class="font-semibold text-lg">Timeline</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-md">
        <div>
          <p class="text-sm text-muted-foreground">Created</p>
          <p class="font-medium">{formatDateTime(task.created_at)}</p>
        </div>
        <div>
          <p class="text-sm text-muted-foreground">Last Updated</p>
          <p>{formatDateTime(task.updated_at)}</p>
        </div>
        {#if task.completed_at}
          <div>
            <p class="text-sm text-muted-foreground">Completed</p>
            <p class="font-medium text-green-700">{formatDateTime(task.completed_at)}</p>
          </div>
        {/if}
      </div>
    </div>
  </Card.Content>
  
  <Card.Footer>
    <div class="text-sm text-muted-foreground">
      Task ID: {task.id}
    </div>
  </Card.Footer>
</Card.Root>