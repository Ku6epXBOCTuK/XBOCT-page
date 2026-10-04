<script lang="ts">
	import type { Bookmark } from "$lib/state/bookmarks.svelte";

	interface Props {
		results: Bookmark[];
		activeIndex: number;
		onselect: (bookmark: Bookmark) => void;
		onhover: (index: number) => void;
	}

	let { results, activeIndex, onselect, onhover }: Props = $props();

	let listEl = $state<HTMLElement>();

	$effect(() => {
		const item = listEl?.children[activeIndex];
		item?.scrollIntoView({ block: "nearest" });
	});
</script>

<div
	class="search-results"
	role="listbox"
	id="search-results"
	tabindex="-1"
	bind:this={listEl}
	onmousedown={(e) => e.preventDefault()}
>
	{#each results as bookmark, i (bookmark.id)}
		<button
			class="result-item"
			class:active={i === activeIndex}
			role="option"
			aria-selected={i === activeIndex}
			onmouseenter={() => onhover(i)}
			onclick={() => onselect(bookmark)}
		>
			{#if bookmark.favicon}
				<img src={bookmark.favicon} alt="" class="result-favicon" />
			{/if}
			<span class="result-title">{bookmark.title}</span>
		</button>
	{/each}
</div>

<style>
	.search-results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: var(--space-2xs);
		background: var(--surface);
		border: 1px solid var(--overlay-white-10);
		border-radius: var(--radius-lg);
		padding: var(--space-2xs);
		max-height: calc(4 * var(--search-result-height));
		overflow-y: auto;
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		height: var(--search-result-height);
		padding: 0 var(--space-sm);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--on-surface);
		font-size: var(--text-sm);
		cursor: pointer;
		text-align: left;
	}

	.result-item.active {
		background: var(--overlay-white-10);
	}

	.result-favicon {
		width: var(--size-favicon-sm);
		height: var(--size-favicon-sm);
		object-fit: contain;
		flex-shrink: 0;
	}

	.result-title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
