<script lang="ts">
  import type { PaginationState, LeadStatus } from "$lib/types";
  import SearchBar from "./search-bar.svelte";
  import Filters from "./filters.svelte";
  import ClientTable from "./client-table.svelte";
  import RefreshButton from "./refresh-button.svelte";  // Add this import
  import { Button } from "$lib/components/ui/button/index.js";
  import Plus from "@lucide/svelte/icons/plus";
  import { goto } from "$app/navigation";
  
  // Import stores
  import { 
    loading,
    setLoading,
    filteredClients, 
    pagination as paginationStore,
    filters as filtersStore 
  } from "$lib/store/clients";
  
  // We still accept props for the initial SSR data
  let { clients, pagination, filters = {} } = $props<{
    clients: any[];
    pagination: PaginationState;
    filters: { search?: string; lead?: LeadStatus };
  }>();
  
  // Use store values directly with $ prefix and $derived for reactivity
  const clientsList = $derived($filteredClients);
  const paginationData = $derived($paginationStore);
  const currentFilters = $derived($filtersStore);
  
  // Compute number of clients found
  const clientsFound = $derived(
    `${paginationData.totalItems} ${paginationData.totalItems === 1 ? 'client' : 'clients'} found`
  );

    // Function to handle pagination click
  function handlePageChange(pageNum: number) {
    if (pageNum === paginationData.currentPage) return; // Skip if it's the current page
    
    // Build URL with current filters
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(pageNum));
    
    // Update loading state before navigation
    setLoading(true);
    
    // Use goto for client-side navigation
    goto(url.toString(), { replaceState: false });
    setLoading(false); // Reset loading state after navigation
  }
</script>

<div class="space-y-4">
  <!-- Header section with title and add button -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Clients</h1>
    <div class="flex items-center gap-2">
      <RefreshButton />  <!-- Add this component -->
      <Button href="/clients/new">
        <Plus class="mr-2 h-4 w-4" />
        Add Client
      </Button>
    </div>
  </div>
  
  <!-- Search and filters row -->
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="w-full sm:max-w-md">
      <SearchBar />
    </div>
    <Filters activeFilter={currentFilters.lead || "all"} />
  </div>
  
  <!-- Results count -->
  <div class="text-sm text-muted-foreground">
    {clientsFound}
  </div>
  
  <!-- Client table - now using the filtered clients from store -->
  <ClientTable clients={clientsList} />
  
  <!-- Pagination -->
{#if paginationData.totalPages > 1}
  <div class="flex justify-center gap-2 pt-4">
    {#each Array(paginationData.totalPages) as _, i}
      {@const pageNum = i + 1}
      {@const isCurrent = pageNum === paginationData.currentPage}
      
      <Button 
        variant={isCurrent ? "default" : "outline"}
        onclick={() => handlePageChange(pageNum)}
        disabled={isCurrent && $loading}
        class="h-8 w-8 p-0"
      >
        {pageNum}
      </Button>
    {/each}
  </div>
{/if}
</div>