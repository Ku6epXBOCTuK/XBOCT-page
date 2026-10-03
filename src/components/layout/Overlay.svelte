<script lang="ts">
	import type { Snippet } from "svelte";
	import { closeOnSelectOutside } from "@/lib/attachments";

	interface Props {
		dark?: boolean;
		z?: string;
		onclose: () => void;
		children: Snippet;
	}

	let { dark = false, z, onclose, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") onclose();
	}
</script>

<div
	class="overlay"
	class:dark
	style:z-index={z}
	role="presentation"
	{@attach closeOnSelectOutside(onclose)}
	onkeydown={handleKeydown}
>
	{@render children()}
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: var(--z-overlay);
		backdrop-filter: blur(var(--blur-sm));
		background: var(--overlay-black-5);
	}

	.overlay.dark {
		background: var(--overlay-black-50);
		z-index: var(--z-dialog);
	}
</style>
