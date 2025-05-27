<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import ClientDetails from "$lib/components/clients/client-details.svelte";
  import type { PageData } from "./$types";
  
  // Get the data from the server load function
  let { data } = $props<{data: PageData}>();
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Client Details</h1>
    <div class="flex gap-2">
      <Button variant="outline" href="/clients">
        Back to Clients
      </Button>
      <Button href="/clients/{data.client.id}/edit">
        Edit Client
      </Button>
    </div>
  </div>
  
  <ClientDetails client={data.client} />
</div>