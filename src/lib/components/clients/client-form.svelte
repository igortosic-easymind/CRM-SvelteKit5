<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import type { Client } from "$lib/types";
  import { enhance } from "$app/forms";
  
  // Props with default values for a new client
  let { 
    client = undefined,
    form = {},
    isSubmitting = false
  } = $props<{
    client?: Client;
    form?: any;
    isSubmitting?: boolean;
  }>();
  
  const isEditMode = $derived(!!client);
  const formTitle = $derived(isEditMode ? 'Edit Client' : 'Add New Client');
  const submitText = $derived(isEditMode ? 'Update Client' : 'Create Client');
  
  // Form enhancement to handle loading state
  function handleSubmit() {
    isSubmitting = true;
    
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      isSubmitting = false;
    };
  }
</script>

<Card.Root class="w-full max-w-3xl mx-auto">
  <Card.Header>
    <Card.Title class="text-2xl">{formTitle}</Card.Title>
    <Card.Description>
      {isEditMode ? 'Update client information' : 'Enter information to create a new client'}
    </Card.Description>
  </Card.Header>
  
  <form method="POST" use:enhance={handleSubmit} class="space-y-8">
    <Card.Content class="space-y-6">
      {#if form?.error}
        <div class="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {form.error}
        </div>
      {/if}
      
      <!-- Company Information -->
      <div>
        <h3 class="font-medium mb-4">Company Information</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="company_name">Company Name</Label>
            <Input 
              id="company_name" 
              name="company_name" 
              value={client?.company_name || ''} 
              required
            />
          </div>
          
          <div class="space-y-2">
            <Label for="website">Website</Label>
            <Input 
              id="website" 
              name="website" 
              type="text" 
              value={client?.website || ''}
            />
          </div>
        </div>
      </div>
      
      <!-- Contact Information -->
      <div>
        <h3 class="font-medium mb-4">Contact Information</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="first_name">First Name</Label>
            <Input 
              id="first_name" 
              name="first_name" 
              value={client?.first_name || ''} 
              required
            />
          </div>
          
          <div class="space-y-2">
            <Label for="last_name">Last Name</Label>
            <Input 
              id="last_name" 
              name="last_name" 
              value={client?.last_name || ''} 
              required
            />
          </div>
          
          <div class="space-y-2">
            <Label for="position">Position</Label>
            <Input 
              id="position" 
              name="position" 
              value={client?.position || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              value={client?.email || ''} 
              required
            />
          </div>
          
          <div class="space-y-2">
            <Label for="phone">Phone</Label>
            <Input 
              id="phone" 
              name="phone" 
              value={client?.phone || ''}
            />
          </div>
        </div>
      </div>
      
      <!-- Address Information -->
      <div>
        <h3 class="font-medium mb-4">Address</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2 md:col-span-2">
            <Label for="address">Street Address</Label>
            <Input 
              id="address" 
              name="address" 
              value={client?.address || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="city">City</Label>
            <Input 
              id="city" 
              name="city" 
              value={client?.city || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="state">State/Province</Label>
            <Input 
              id="state" 
              name="state" 
              value={client?.state || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="zipcode">Zip/Postal Code</Label>
            <Input 
              id="zipcode" 
              name="zipcode" 
              value={client?.zipcode || ''}
            />
          </div>
        </div>
      </div>
      
      <!-- Lead Information -->
      <div>
        <h3 class="font-medium mb-4">Lead Information</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <Label for="lead">Lead Status</Label>
            <select 
              id="lead" 
              name="lead" 
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="cold" selected={client?.lead === 'cold'}>Cold</option>
              <option value="warm" selected={client?.lead === 'warm'}>Warm</option>
              <option value="hot" selected={client?.lead === 'hot'}>Hot</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <Label for="linkedin_connection">LinkedIn</Label>
            <Input 
              id="linkedin_connection" 
              name="linkedin_connection" 
              value={client?.linkedin_connection || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="related_name">Related Name</Label>
            <Input 
              id="related_name" 
              name="related_name" 
              value={client?.related_name || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="first_contact">First Contact Date</Label>
            <Input 
              id="first_contact" 
              name="first_contact" 
              type="date" 
              value={client?.first_contact || ''}
            />
          </div>
        </div>
      </div>
      
      <!-- Additional Information -->
      <div>
        <h3 class="font-medium mb-4">Additional Information</h3>
        <div class="grid gap-4">
          <div class="space-y-2">
            <Label for="comments">Comments</Label>
            <textarea
              id="comments"
              name="comments"
              rows="3"
              class="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >{client?.comments || ''}</textarea>
          </div>
          
          <div class="space-y-2">
            <Label for="description_contact">Contact Description</Label>
            <Input 
              id="description_contact" 
              name="description_contact" 
              value={client?.description_contact || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="description_contact_more">Additional Contact Notes</Label>
            <Input 
              id="description_contact_more" 
              name="description_contact_more" 
              value={client?.description_contact_more || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="follow_up_action">Follow-up Action</Label>
            <Input 
              id="follow_up_action" 
              name="follow_up_action" 
              value={client?.follow_up_action || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="new_business">New Business Potential</Label>
            <Input 
              id="new_business" 
              name="new_business" 
              value={client?.new_business || ''}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="recommendation">Recommendation</Label>
            <Input 
              id="recommendation" 
              name="recommendation" 
              value={client?.recommendation || ''}
            />
          </div>
        </div>
      </div>
    </Card.Content>
    
    <Card.Footer class="flex justify-between">
      <Button type="button" variant="outline" href="/clients">
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitText}
      </Button>
    </Card.Footer>
  </form>
</Card.Root>