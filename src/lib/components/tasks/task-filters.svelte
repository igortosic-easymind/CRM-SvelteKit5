<script lang="ts">
  import { 
    updateTasksFilters, 
    tasksFilters,
    tasksLoading
  } from "$lib/store/tasks";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { TaskStatus } from "$lib/types";
  
  const { activeFilter = "all" } = $props<{ activeFilter?: TaskStatus | "all" }>();
  
  // Access store directly with $derived
  const isLoading = $derived($tasksLoading);
  const storeFilters = $derived($tasksFilters);
  
  const filterOptions: { value: TaskStatus | "all"; label: string; color: string }[] = [
    { value: "all", label: "All Tasks", color: "bg-gray-100" },
    { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-700" },
    { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
    { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" }
  ];
  
  function handleFilterChange(filter: TaskStatus | "all") {
    // Update store directly
    if (filter === "all") {
      updateTasksFilters({ status: null });
    } else {
      updateTasksFilters({ status: filter });
    }
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (filter === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", filter);
    }
    url.searchParams.delete("page"); // Reset to first page when filtering
    history.pushState({}, "", url.toString());
  }
</script>

<div class="flex items-center gap-2">
  {#each filterOptions as filter}
    <Button 
      variant={activeFilter === filter.value ? "default" : "outline"}
      size="sm"
      disabled={isLoading}
      onclick={() => handleFilterChange(filter.value)}
    >
      {#if filter.value !== "all"}
        <span class={`inline-block h-2 w-2 rounded-full mr-1.5 ${
          filter.value === "completed" ? "bg-green-500" : 
          filter.value === "in-progress" ? "bg-blue-500" : 
          "bg-gray-500"
        }`}></span>
      {/if}
      {filter.label}
    </Button>
  {/each}
</div>