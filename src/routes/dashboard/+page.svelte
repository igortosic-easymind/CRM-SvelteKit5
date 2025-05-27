<script lang="ts">
    import * as Card from '$lib/components/ui/card/index.js';
    import type { PageData } from './$types';
  
    let { data } = $props<{data: PageData}>();
  </script>

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Dashboard</h1>
    </div>
    
    <Card.Root>
      <Card.Header>
        <Card.Title>Welcome back, {data.user.username}</Card.Title>
        <Card.Description>Your account ID: {data.user.id}</Card.Description>
      </Card.Header>
      <Card.Content>
        <p>This is a protected dashboard page. Only authenticated users can see this content.</p>
      </Card.Content>
    </Card.Root>
  </div>