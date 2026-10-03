<script lang="ts">
	import Button from "$cmp/ui/Button.svelte";
	import type { BackupSlot } from "$lib/state/backup.svelte";
	import FileJsonIcon from "~icons/lucide/file-json";
	import SaveIcon from "~icons/lucide/save";

	interface Props {
		title: string;
		description: string;
		slot: BackupSlot;
	}

	let { title, description, slot }: Props = $props();
</script>

<div class="backup-slot">
	<h4 class="slot-title">{title}</h4>
	<p class="slot-desc">{description}</p>

	{#if slot.fileName}
		<p class="slot-info">Файл: {slot.fileName}</p>
		<p class="slot-info">
			Последний бэкап: {slot.lastBackupAt
				? new Date(slot.lastBackupAt).toLocaleString()
				: "никогда"}
		</p>
	{/if}

	<div class="slot-buttons">
		<Button
			label={slot.configured ? "Изменить файл" : "Выбрать файл"}
			icon={FileJsonIcon}
			variant="secondary"
			onclick={() => slot.chooseFile()}
		/>
		{#if slot.configured}
			<Button
				label="Сохранить сейчас"
				icon={SaveIcon}
				variant="secondary"
				onclick={() => slot.tryWrite(true)}
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
