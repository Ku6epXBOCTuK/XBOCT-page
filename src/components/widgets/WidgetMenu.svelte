<script lang="ts">
	import Overlay from "$cmp/layout/Overlay.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		open: boolean;
		onclose: () => void;
		children: Snippet;
	}

	let { open, onclose, children }: Props = $props();
</script>

{#if open}
	<Overlay {onclose}>
		<div
			class="menu"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === "Escape" && onclose()}
			role="menu"
			tabindex="-1"
		>
			{@render children()}
		</div>
	</Overlay>
{/if}

<style>
	.menu {
		position: absolute;
		top: 2rem;
		right: 0.5rem;
		min-width: 120px;
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: 0.5rem;
		padding: 0.25rem;
	}
</style>
