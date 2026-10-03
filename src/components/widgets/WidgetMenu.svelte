<script lang="ts">
	import { computePosition, flip, shift, offset } from "@floating-ui/dom";
	import Overlay from "$cmp/layout/Overlay.svelte";
	import type { Snippet } from "svelte";

	interface Props {
		open: boolean;
		buttonRef?: HTMLElement;
		onclose: () => void;
		children: Snippet;
	}

	let { open, buttonRef, onclose, children }: Props = $props();

	let menuEl = $state<HTMLElement>();

	$effect(() => {
		if (open && buttonRef && menuEl) {
			computePosition(buttonRef, menuEl, {
				placement: "bottom-end",
				middleware: [
					offset(4),
					flip({ fallbackPlacements: ["top-end"] }),
					shift({ padding: 8 }),
				],
			}).then((pos) => {
				menuEl!.style.left = `${pos.x}px`;
				menuEl!.style.top = `${pos.y}px`;
			});
		}
	});
</script>

{#if open}
	<Overlay {onclose}>
		<div
			bind:this={menuEl}
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
		position: fixed;
		z-index: var(--z-menu);
		min-width: var(--menu-min-width);
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		padding: var(--space-2xs);
	}
</style>
