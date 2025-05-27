<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { calendarView } from "$lib/store/calendar";

  const dispatch = createEventDispatcher<{
    viewChange: "month" | "week";
  }>();

  function handleViewChange(view: "month" | "week") {
    dispatch("viewChange", view);
  }
</script>

<div class="flex items-center space-x-1 rounded-md border p-1">
  <Button
    variant={$calendarView === "month" ? "default" : "ghost"}
    size="sm"
    onclick={() => handleViewChange("month")}
    class="px-3 py-1"
  >
    Month
  </Button>
  <Button
    variant={$calendarView === "week" ? "default" : "ghost"}
    size="sm"
    onclick={() => handleViewChange("week")}
    class="px-3 py-1"
  >
    Week
  </Button>
</div> 