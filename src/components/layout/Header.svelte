<script lang="ts">
	import { backup } from "$lib/state/backup.svelte";
	import { theme } from "$lib/state/theme.svelte";
	import MoonIcon from "~icons/lucide/moon";
	import SettingsIcon from "~icons/lucide/settings";
	import SunIcon from "~icons/lucide/sun";
	import SettingsDialog from "../dialogs/SettingsDialog.svelte";
	import Search from "../ui/Search.svelte";

	let settingsOpen = $state(false);
</script>

<header class="header">
	<div class="header-left">
		<span class="logo">XBOCT</span>
		<Search />
	</div>
	<div class="header-right">
		<button class="icon-button" onclick={theme.toggle} title="Переключить тему">
			{#if theme.current === "dark"}
				<SunIcon />
			{:else}
				<MoonIcon />
			{/if}
		</button>
		<button
			class="icon-button settings-button"
			onclick={() => (settingsOpen = true)}
			title={backup.initialized && !backup.configured
				? "Настройки (бэкап не настроен)"
				: "Настройки"}
		>
			<SettingsIcon class="settings-icon" />
			{#if backup.initialized && !backup.configured}
				<span class="backup-badge"></span>
			{/if}
		</button>
	</div>
</header>

{#if settingsOpen}
	<SettingsDialog onclose={() => (settingsOpen = false)} />
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: var(--z-header);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-xl);
		background: var(--surface-alpha);
		backdrop-filter: blur(var(--blur-md));
		border-bottom: 1px solid var(--overlay-white-5);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
	}

	.logo {
		font-size: var(--text-lg);
		font-weight: 700;
		letter-spacing: var(--tracking-tight);
		color: var(--on-surface);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2xs);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--on-surface-variant);
		cursor: pointer;
		transition: background var(--transition-normal);
	}

	.icon-button:hover {
		background: var(--surface-variant);
	}

	.icon-button :global(svg) {
		width: var(--size-icon-md);
		height: var(--size-icon-md);
	}

	.icon-button :global(.settings-icon) {
		color: var(--on-surface-variant);
	}

	.settings-button {
		position: relative;
	}

	.backup-badge {
		position: absolute;
		top: var(--space-2xs);
		right: var(--space-2xs);
		width: var(--size-badge);
		height: var(--size-badge);
		border-radius: var(--radius-full);
		background: var(--danger);
	}
</style>
