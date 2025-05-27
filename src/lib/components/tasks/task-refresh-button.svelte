<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { RefreshCw } from "@lucide/svelte";
  import { tasksLoading, setTasksLoading } from "$lib/store/tasks";
  import { invalidate } from "$app/navigation";
  
  // Using $derived for reactivity in Svelte 5
  const isLoading = $derived($tasksLoading);
  
  async function refreshTasks() {
    if (isLoading) return;
    
    // Update loading state
    setTasksLoading(true);
    
    try {
      await invalidate("app:tasks");
    } catch (error) {
      console.error("Failed to refresh tasks:", error);
    } finally {
      setTasksLoading(false);
    }
  }
</script>

<Button 
  variant="ghost" 
  size="sm" 
  onclick={refreshTasks} 
  disabled={isLoading}
  aria-label="Refresh task list"
>
  <RefreshCw class={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
</Button>