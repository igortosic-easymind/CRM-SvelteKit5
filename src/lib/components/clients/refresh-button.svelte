<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { RefreshCw } from "@lucide/svelte";
  import { loading, setLoading } from "$lib/store/clients";
  import { invalidate } from "$app/navigation";
  
  // Using $derived for reactivity in Svelte 5
  const isLoading = $derived($loading);
  
  async function refreshClients() {
    if (isLoading) return;
    
    // Update loading state
    setLoading(true);
    
    try {
      // Add a small delay for testing to see the animation
      // Remove this in production
      // await new Promise(resolve => setTimeout(resolve, 300));
      
      await invalidate("app:clients");
    } catch (error) {
      console.error("Failed to refresh clients:", error);
    } finally {
      setLoading(false);
    }
  }
</script>

<Button 
  variant="ghost" 
  size="sm" 
  onclick={refreshClients} 
  disabled={isLoading}
  aria-label="Refresh client list"
>
  <!-- Make sure the Tailwind animation class exists and is applied correctly -->
  <RefreshCw class={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
</Button>