<script lang="ts">
	import Overlay from "$cmp/layout/Overlay.svelte";
	import { computePosition, flip, offset, shift } from "@floating-ui/dom";
	import type { Snippet } from "svelte";

	interface Props {
		open: boolean;
		anchorRef?: HTMLElement;
		onclose: () => void;
		children: Snippet;
	}

	let { open, anchorRef, onclose, children }: Props = $props();

	let panelEl = $state<HTMLElement>();

	$effect(() => {
		if (open && anchorRef && panelEl) {
			computePosition(anchorRef, panelEl, {
				placement: "bottom-start",
				middleware: [offset(4), flip(), shift({ padding: 8 })],
			}).then((pos) => {
				panelEl!.style.left = `${pos.x}px`;
				panelEl!.style.top = `${pos.y}px`;
			});
		}
	});
</script>

{#if open}
	<Overlay {onclose} z="var(--z-popover)">
		<div
			bind:this={panelEl}
			class="popover"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.key === "Escape" && onclose()}
			role="dialog"
			tabindex="-1"
		>
			{@render children()}
		</div>
	</Overlay>
{/if}

<style>
	.popover {
		position: fixed;
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		padding: var(--space-sm);
		max-height: 50vh;
		overflow-y: auto;
	}
</style>
