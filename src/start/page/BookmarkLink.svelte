<script lang="ts">
	import type { Bookmark } from "@/state/bookmarks.svelte";
	import { createDraggable } from "@dnd-kit/svelte";

	interface Props {
		bookmark: Bookmark;
		groupId: string;
	}

	let { bookmark, groupId }: Props = $props();

	const draggable = createDraggable({
		id: `bookmark:${bookmark.id}:${groupId}`,
	});

	let longPressTimer = $state<number | null>(null);
	let showProgress = $state(false);
	let progress = $state(0);

	function handlePointerDown() {
		longPressTimer = window.setTimeout(() => {
			showProgress = true;
			animateProgress();
		}, 1000);
	}

	function handlePointerUp() {
		if (longPressTimer !== null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
		if (!showProgress) {
			return;
		}
	}

	function handlePointerLeave() {
		if (longPressTimer !== null) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}
		showProgress = false;
		progress = 0;
	}

	function animateProgress() {
		const duration = 1000;
		const startTime = Date.now();
		const update = () => {
			const elapsed = Date.now() - startTime;
			progress = Math.min((elapsed / duration) * 100, 100);
			if (progress < 100) {
				requestAnimationFrame(update);
			}
		};
		requestAnimationFrame(update);
	}
</script>

<a
	class="bookmark-link"
	href={bookmark.url}
	target="_blank"
	rel="noopener noreferrer"
	{@attach draggable.attach}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerLeave}
	role="link"
>
	{#if bookmark.favicon}
		<img src={bookmark.favicon} alt="" class="bookmark-favicon" />
	{/if}
	<span class="bookmark-title">{bookmark.title}</span>
	{#if showProgress}
		<svg class="progress-ring" viewBox="0 0 24 24">
			<circle
				class="progress-ring-circle"
				cx="12"
				cy="12"
				r="10"
				stroke-dasharray={2 * Math.PI * 10}
				stroke-dashoffset={2 * Math.PI * 10 * (1 - progress / 100)}
			/>
		</svg>
	{/if}
</a>

<style>
	.bookmark-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 0.375rem;
		background: transparent;
		border: none;
		border-radius: 0.25rem;
		color: var(--on-surface-variant);
		font-size: 0.75rem;
		text-align: left;
		cursor: pointer;
		text-decoration: none;
		transition:
			background 0.2s,
			color 0.2s;
		position: relative;
	}

	.bookmark-link:hover {
		background: var(--overlay-white-5);
		color: var(--on-surface);
	}

	.bookmark-favicon {
		width: 16px;
		height: 16px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.bookmark-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.progress-ring {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 24px;
		height: 24px;
		pointer-events: none;
	}

	.progress-ring-circle {
		fill: none;
		stroke: var(--primary);
		stroke-width: 2;
		transform: rotate(-90deg);
		transform-origin: 50% 50%;
	}
</style>
