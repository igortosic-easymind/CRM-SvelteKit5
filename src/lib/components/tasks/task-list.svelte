<script lang="ts">
  import type { PaginationState, TaskStatus } from "$lib/types";
  import TaskSearchBar from "./task-search-bar.svelte";
  import TaskFilters from "./task-filters.svelte";
  import TaskTable from "./task-table.svelte";
  import TaskRefreshButton from "./task-refresh-button.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import Plus from "@lucide/svelte/icons/plus";
  import { goto } from "$app/navigation";
  
  // Import stores
  import { 
    tasksLoading,
    setTasksLoading,
    filteredTasks, 
    tasksPagination as paginationStore,
    tasksFilters as filtersStore 
  } from "$lib/store/tasks";
  
  // We still accept props for the initial SSR data
  let { tasks, pagination, filters = {} } = $props<{
    tasks: any[];
    pagination: PaginationState;
    filters: { search?: string; status?: TaskStatus; client_id?: number };
  }>();
  
  // Use store values directly with $ prefix and $derived for reactivity
  const tasksList = $derived($filteredTasks);
  const paginationData = $derived($paginationStore);
  const currentFilters = $derived($filtersStore);
  
  // Compute number of tasks found
  const tasksFound = $derived(
    `${paginationData.totalItems} ${paginationData.totalItems === 1 ? 'task' : 'tasks'} found`
  );

  // Function to handle pagination click
  function handlePageChange(pageNum: number) {
    if (pageNum === paginationData.currentPage) return; // Skip if it's the current page
    
    // Build URL with current filters
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(pageNum));
    
    // Update loading state before navigation
    setTasksLoading(true);
    
    // Use goto for client-side navigation
    goto(url.toString(), { replaceState: false });
    setTasksLoading(false); // Reset loading state after navigation
  }
</script>

<div class="space-y-4">
  <!-- Header section with title and add button -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Tasks</h1>
    <div class="flex items-center gap-2">
      <TaskRefreshButton />
      <Button href="/tasks/new">
        <Plus class="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
  </div>
  
  <!-- Search and filters row -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="w-full sm:max-w-md">
      <TaskSearchBar />
    </div>
    <TaskFilters activeFilter={currentFilters.status || "all"} />
  </div>
  
  <!-- Results count -->
  <div class="text-sm text-muted-foreground">
    {tasksFound}
  </div>
  
  <!-- Task table - now using the filtered tasks from store -->
  <TaskTable tasks={tasksList} />
  
  <!-- Pagination -->
  {#if paginationData.totalPages > 1}
    <div class="flex justify-center gap-2 pt-4">
      {#each Array(paginationData.totalPages) as _, i}
        {@const pageNum = i + 1}
        {@const isCurrent = pageNum === paginationData.currentPage}
        
        <Button 
          variant={isCurrent ? "default" : "outline"}
          onclick={() => handlePageChange(pageNum)}
          disabled={isCurrent && $tasksLoading}
          class="h-8 w-8 p-0"
        >
          {pageNum}
        </Button>
      {/each}
    </div>
  {/if}
</div>