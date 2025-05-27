
<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
    import { ArrowRight, Users, BarChart2, Calendar } from "@lucide/svelte";
</script>

    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
   
        <header class="flex justify-between items-center mb-16">
          <a href="/" class="flex items-center space-x-2">
            <span class="text-2xl">Easymindstudio CRM</span>
          </a>
          <Button
            href="/login"
            class="inline-flex items-center px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Login
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </header>

    
        <main class="text-center mb-16">
          <h1 class="text-4xl sm:text-6xl font-bold mb-6">Welcome to Your Business Hub</h1>
          <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your client relationships with our comprehensive CRM solution. Track leads, manage contacts, and
            grow your business efficiently.
          </p>

          <div class="grid md:grid-cols-3 gap-8 mb-16">
            <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Users class="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 class="text-xl font-semibold mb-2">Client Management</h2>
              <p class="text-gray-600">Keep track of all your clients and leads in one place</p>
            </div>
            <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <BarChart2 class="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 class="text-xl font-semibold mb-2">Analytics</h2>
              <p class="text-gray-600">Gain insights from detailed business analytics</p>
            </div>
            <div class="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <Calendar class="h-12 w-12 mb-4 mx-auto text-blue-500" />
              <h2 class="text-xl font-semibold mb-2">Task Planning</h2>
              <p class="text-gray-600">Schedule and track follow-ups and meetings</p>
            </div>
          </div>
        </main>

   
        <footer class="text-center text-gray-600">
          <p class="mb-4">
            Powered by{" "}
            <a
              href="https://www.easymindstudio.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:underline"
            >
              Easymindstudio
            </a>
          </p>
          <div class="text-sm">© {new Date().getFullYear()} All rights reserved.</div>
        </footer>
      </div>
    </div>
