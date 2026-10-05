<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import { backup } from "$lib/state/backup.svelte";
	import FolderIcon from "~icons/lucide/folder";
	import SaveIcon from "~icons/lucide/save";
</script>

<div class="backup-slot">
	<h4 class="slot-title">Папка бэкапов</h4>
	<p class="slot-desc">
		Мгновенный бэкап при каждом изменении (xboct-latest.json) и дневной снимок
		при первом запуске за день. Хранятся: последние 3 дня, по одному снимку в
		неделю за 5 недель и в месяц за год.
	</p>

	{#if backup.dirName}
		<p class="slot-info">Папка: {backup.dirName}</p>
		<p class="slot-info">
			Мгновенный: {backup.lastInstantAt
				? new Date(backup.lastInstantAt).toLocaleString()
				: "никогда"}
		</p>
		<p class="slot-info">Дневной: {backup.lastDailyDay ?? "никогда"}</p>
	{/if}

	<div class="slot-buttons">
		<Button
			label={backup.configured ? "Изменить папку" : "Выбрать папку"}
			icon={FolderIcon}
			variant="secondary"
			onclick={() => backup.chooseFolder()}
		/>
		{#if backup.configured}
			<Button
				label="Сохранить сейчас"
				icon={SaveIcon}
				variant="secondary"
				onclick={() => backup.tryWrite(true)}
			/>
		{/if}
	</div>
</div>

<style>
	.backup-slot {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		padding: var(--space-md);
		background: var(--overlay-white-3);
		border-radius: var(--radius-lg);
	}

	.slot-title {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--on-surface);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: var(--tracking-wide);
	}

	.slot-desc {
		font-size: var(--text-xs);
		color: var(--on-surface-dim);
		margin: 0;
	}

	.slot-info {
		font-size: var(--text-xs);
		color: var(--on-surface-variant);
		margin: 0;
	}

	.slot-buttons {
		display: flex;
		gap: var(--space-md);
	}
</style>
