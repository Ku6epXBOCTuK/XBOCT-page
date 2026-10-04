<script lang="ts">
	import AddCurrentTab from "$cmp/popup/AddCurrentTab.svelte";
	import RecentBookmarks from "$cmp/popup/RecentBookmarks.svelte";
	import Button from "$cmp/ui/Button.svelte";
	import { bookmarks } from "$lib/state/bookmarks.svelte";
	import { onMount } from "svelte";
	import ExternalLinkIcon from "~icons/lucide/external-link";
	import "../vars.css";
	import "./style.css";

	onMount(() => {
		bookmarks.load();
	});

	function openStartPage() {
		chrome.tabs.create({
			url: chrome.runtime.getURL("src/start/index.html"),
		});
	}
</script>

<div class="popup">
	<AddCurrentTab />
	<RecentBookmarks />
	<Button
		label="Открыть стартовую страницу"
		icon={ExternalLinkIcon}
		variant="secondary"
		onclick={openStartPage}
	/>
</div>

<style>
	.popup {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		width: 300px;
		padding: var(--space-md);
		background: var(--surface);
		color: var(--on-surface);
		font-family: var(--font-sans);
	}
</style>
