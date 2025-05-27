<script lang="ts">
  import type { Client } from "$lib/types";
  import { Button } from "$lib/components/ui/button/index.js";
  import Eye from "@lucide/svelte/icons/eye";
  import Edit from "@lucide/svelte/icons/edit";
  import { loading } from "$lib/store/clients";
  import DeleteClientDialog from "./delete-client-dialog.svelte";

  // Proper Svelte 5 props syntax
  const { clients = [] } = $props<{ clients?: Client[] }>();
  
  // Access loading state from store with $derived
  const isLoading = $derived($loading);
  
  function formatDate(dateString: string) {
    if (!dateString) return "—";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }
  
  function getLeadStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case "hot": return "bg-red-100 text-red-700";
      case "warm": return "bg-amber-100 text-amber-700";
      case "cold": return "bg-blue-100 text-blue-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }
</script>

<div class="relative overflow-x-auto rounded-md border shadow-sm">
  {#if isLoading}
    <div class="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
      <div class="text-sm">Loading clients...</div>
    </div>
  {/if}
  
  <table class="w-full text-left text-sm">
    <thead class="bg-muted/50 text-muted-foreground uppercase text-xs">
      <tr>
        <th scope="col" class="px-4 py-3">Company</th>
        <th scope="col" class="px-4 py-3">Contact</th>
        <th scope="col" class="px-4 py-3">Email</th>
        <th scope="col" class="px-4 py-3">Status</th>
        <th scope="col" class="px-4 py-3">Created</th>
        <th scope="col" class="px-4 py-3">Last Contact</th>
        <th scope="col" class="px-4 py-3 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each clients as client}
        <tr class="border-b bg-card hover:bg-muted/20">
          <td class="px-4 py-3 font-medium">{client.company_name || "—"}</td>
          <td class="px-4 py-3">{client.first_name} {client.last_name}</td>
          <td class="px-4 py-3">{client.email}</td>
          <td class="px-4 py-3">
            <span class={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getLeadStatusClass(client.lead)}`}>
              {client.lead}
            </span>
          </td>
          <td class="px-4 py-3">{formatDate(client.created_at)}</td>
          <td class="px-4 py-3">{client.date_of_last_contact ? formatDate(client.date_of_last_contact) : "Never"}</td>
          <td class="px-4 py-3 text-right">
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="icon" href={`/clients/${client.id}`} disabled={isLoading}>
                <Eye class="h-4 w-4" />
                <span class="sr-only">View</span>
              </Button>
              <Button variant="ghost" size="icon" href={`/clients/${client.id}/edit`} disabled={isLoading}>
                <Edit class="h-4 w-4" />
                <span class="sr-only">Edit</span>
              </Button>
              <DeleteClientDialog client={client} disabled={isLoading} />
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Empty state -->
{#if clients.length === 0 && !isLoading}
  <div class="flex flex-col items-center justify-center rounded-md border py-16 text-center">
    <p class="mb-4 text-muted-foreground">No clients found</p>
    <Button href="/clients/new">Add your first client</Button>
  </div>
{/if}