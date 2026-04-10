<script lang="ts">
	import SettingsIcon from "~icons/lucide/settings";
	import Search from "./Search.svelte";

	interface Props {
		onSearch?: (query: string) => void;
	}

	let { onSearch }: Props = $props();
</script>

<header class="header">
	<div class="header-left">
		<span class="logo">XBOCT</span>
		<Search {onSearch} />
	</div>
	<div class="header-right">
		<button class="icon-button">
			<SettingsIcon class="settings-icon" />
		</button>
	</div>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1.5rem;
		background: var(--surface-alpha);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.logo {
		font-size: 1.125rem;
		font-weight: 700;
		letter-spacing: -0.025em;
		color: var(--on-surface);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		color: var(--on-surface-variant);
		cursor: pointer;
		transition: background 0.2s;
	}

	.icon-button:hover {
		background: var(--surface-variant);
	}

	.icon-button :global(.settings-icon) {
		color: var(--on-surface-variant);
	}
</style>
