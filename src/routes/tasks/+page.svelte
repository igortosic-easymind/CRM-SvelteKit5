<script lang="ts">
  import TaskList from "$lib/components/tasks/task-list.svelte";
  import type { PageData } from "./$types";
  
  // Get the data from the server load function
  let { data } = $props<{data: PageData}>();
</script>

<TaskList 
  tasks={data.tasks} 
  pagination={data.pagination} 
  filters={data.filters} 
/>
