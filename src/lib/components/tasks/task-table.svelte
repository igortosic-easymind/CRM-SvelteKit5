<script lang="ts">
  import type { Task } from "$lib/types";
  import { Button } from "$lib/components/ui/button/index.js";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import Trash from "@lucide/svelte/icons/trash";
  import { tasksLoading } from "$lib/store/tasks";
  import DeleteTaskDialog from "./delete-task-dialog.svelte";

  // Proper Svelte 5 props syntax
  const { tasks = [] } = $props<{ tasks?: Task[] }>();
  
  // Access loading state from store with $derived
  const isLoading = $derived($tasksLoading);
  
  function formatDate(dateString: string | undefined) {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  
  function getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-700";
      case "in-progress": return "bg-blue-100 text-blue-700";
      case "todo": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
  
  function getPriorityClass(priority: string | undefined): string {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
  
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

<div class="relative overflow-x-auto rounded-md border shadow-sm">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <div class="text-sm">Loading tasks...</div>
    </div>
  {/if}
  
  <table class="w-full text-left text-sm">
    <thead class="bg-muted/50 text-muted-foreground uppercase text-xs">
      <tr>
        <th scope="col" class="px-4 py-3">Title</th>
        <th scope="col" class="px-4 py-3">Priority</th>
        <th scope="col" class="px-4 py-3">Status</th>
        <th scope="col" class="px-4 py-3">Due Date</th>
        <th scope="col" class="px-4 py-3">Type</th>
        <th scope="col" class="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each tasks as task}
        <tr class="border-b bg-card hover:bg-muted/20">
          <td class="px-4 py-3">
            <div>
              <p class="font-medium">{task.title}</p>
              {#if task.description}
                <p class="text-muted-foreground text-xs mt-1 truncate max-w-48">
                  {task.description}
                </p>
              {/if}
            </div>
          </td>
          <td class="px-4 py-3">
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}>
              {task.priority || "—"}
            </span>
          </td>
          <td class="px-4 py-3">
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(task.status)}`}>
              {task.status}
            </span>
          </td>
          <td class="px-4 py-3">{formatDate(task.due_date)}</td>
          <td class="px-4 py-3">
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClass(task.type)}`}>
              {task.type || "—"}
            </span>
          </td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="icon" href={`/tasks/${task.id}`} disabled={isLoading}>
                <Eye class="h-4 w-4" />
                <span class="sr-only">View</span>
              </Button>
              <Button variant="ghost" size="icon" href={`/tasks/${task.id}/edit`} disabled={isLoading}>
                <Edit class="h-4 w-4" />
                <span class="sr-only">Edit</span>
              </Button>
              <DeleteTaskDialog task={task} disabled={isLoading} />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Empty state -->
{#if tasks.length === 0 && !isLoading}
  <div class="flex flex-col items-center justify-center rounded-md border py-16 text-center">
    <p class="mb-4 text-muted-foreground">No tasks found</p>
    <Button href="/tasks/new">Add your first task</Button>
  </div>
{/if}