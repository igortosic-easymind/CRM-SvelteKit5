<!-- src/routes/tasks/[id]/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import TaskDetails from "$lib/components/tasks/task-details.svelte";
  import type { PageData } from "./$types";
  
  // Get the data from the server load function
  let { data } = $props<{data: PageData}>();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Task Details</h1>
    <div class="flex gap-2">
      <Button variant="outline" href="/tasks">
        Back to Tasks
      </Button>
      <Button href="/tasks/{data.task.id}/edit">
        Edit Task
      </Button>
    </div>
  </div>
  
  <TaskDetails task={data.task} />
</div>