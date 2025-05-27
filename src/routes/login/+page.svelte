<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import type { AuthResponse } from "$lib/types";

	export let form: AuthResponse;
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm {form} />
</div>