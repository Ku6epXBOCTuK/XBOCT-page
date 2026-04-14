<script lang="ts">
	import type { Snippet } from "svelte";
	import { closeOnSelectOutside } from "@/lib/attachments";

	interface Props {
		dark?: boolean;
		onclose: () => void;
		children: Snippet;
	}

	let { dark = false, onclose, children }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") onclose();
	}
</script>

<div
	class="overlay"
	class:dark
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
		z-index: 100;
	}

	.overlay.dark {
		background: var(--overlay-black-70);
		z-index: 1000;
	}
</style>
