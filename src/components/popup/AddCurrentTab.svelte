<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import Select from "$cmp/ui/Select.svelte";
	import { getFaviconUrl } from "$lib/services/bookmarksStorage";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { onMount } from "svelte";
	import PlusIcon from "~icons/lucide/plus";

	let tab = $state<chrome.tabs.Tab | null>(null);
	let groupId = $state("");
	let added = $state(false);

	let groupOptions = $derived(
		bookmarks.getGroups().map((g) => ({ value: g.id, label: g.name })),
	);

	$effect(() => {
		if (!groupId && groupOptions.length > 0) {
			groupId = groupOptions[0].value;
		}
	});

	onMount(async () => {
		const [activeTab] = await chrome.tabs.query({
			active: true,
			currentWindow: true,
		});
		tab = activeTab ?? null;
	});

	function handleAdd() {
		if (!tab?.url || !groupId) return;
		bookmarks.addBookmark(groupId, {
			id: crypto.randomUUID(),
			title: tab.title || tab.url,
			url: tab.url,
			favicon: tab.favIconUrl || getFaviconUrl(tab.url),
		});
		added = true;
		setTimeout(() => (added = false), 2000);
	}
</script>

<div class="add-current">
	{#if tab}
		<div class="tab-preview">
			{#if tab.favIconUrl}
				<img src={tab.favIconUrl} alt="" class="tab-favicon" />
			{/if}
			<span class="tab-title">{tab.title || tab.url}</span>
		</div>
		{#if groupOptions.length > 0}
			<div class="add-row">
				<Select bind:value={groupId} options={groupOptions} />
				<Button
					label={added ? "Добавлено" : "Добавить"}
					icon={PlusIcon}
					variant="primary"
					disabled={added}
					onclick={handleAdd}
				/>
			</div>
		{:else}
			<p class="hint">Сначала создайте группу на стартовой странице</p>
		{/if}
	{/if}
</div>

<style>
	.add-current {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.tab-preview {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-width: 0;
	}

	.tab-favicon {
		width: var(--size-favicon-sm);
		height: var(--size-favicon-sm);
		object-fit: contain;
		flex-shrink: 0;
	}

	.tab-title {
		font-size: var(--text-sm);
		color: var(--on-surface);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.add-row {
		display: flex;
		gap: var(--space-sm);
	}

	.add-row :global(.select) {
		flex: 1;
		min-width: 0;
	}

	.hint {
		font-size: var(--text-xs);
		color: var(--on-surface-dim);
		margin: 0;
	}
</style>
