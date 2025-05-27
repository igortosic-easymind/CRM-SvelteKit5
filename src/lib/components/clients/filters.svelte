<script lang="ts">
  import { 
    updateFilters, 
    filters,
    loading
  } from "$lib/store/clients";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { LeadStatus } from "$lib/types";
  
  const { activeFilter = "all" } = $props<{ activeFilter?: LeadStatus | "all" }>();
  
  // Access store directly with $derived
  const isLoading = $derived($loading);
  const storeFilters = $derived($filters);
  
  const filterOptions: { value: LeadStatus | "all"; label: string; color: string }[] = [
    { value: "all", label: "All Leads", color: "bg-gray-100" },
    { value: "hot", label: "Hot", color: "bg-red-100 text-red-700" },
    { value: "warm", label: "Warm", color: "bg-amber-100 text-amber-700" },
    { value: "cold", label: "Cold", color: "bg-blue-100 text-blue-700" }
  ];
  
  function handleFilterChange(filter: LeadStatus | "all") {
    // Update store directly
    if (filter === "all") {
      updateFilters({ lead: null });
    } else {
      updateFilters({ lead: filter });
    }
    
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (filter === "all") {
      url.searchParams.delete("lead");
    } else {
      url.searchParams.set("lead", filter);
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
        <span class={`inline-block h-2 w-2 rounded-full ${filter.value === "hot" ? "bg-red-500" : filter.value === "warm" ? "bg-amber-500" : "bg-blue-500"} mr-1.5`}></span>
      {/if}
      {filter.label}
    </Button>
  {/each}
</div>