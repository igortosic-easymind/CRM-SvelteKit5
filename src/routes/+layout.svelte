<script lang="ts">
  import '../app.css';
  import ProtectedLayout from "$lib/components/layouts/protected-layout.svelte";
  import type { LayoutData } from './$types';
  
  let { data, children } = $props<{data: LayoutData, children: any}>();
</script>

{#if data.user}
  <ProtectedLayout user={data.user}>
    {@render children()}
  </ProtectedLayout>
{:else}
  {@render children()}
{/if}
