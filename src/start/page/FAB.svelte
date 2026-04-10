<script lang="ts">
	import PlusIcon from "~icons/lucide/plus";

	interface Props {
		onclick?: () => void;
	}

	let { onclick }: Props = $props();
</script>

<button class="fab" {onclick}>
	<PlusIcon />
</button>

<style>
	.fab {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary);
		color: var(--on-primary);
		border: none;
		border-radius: 9999px;
		cursor: pointer;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -2px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.15s,
			box-shadow 0.15s;
		z-index: 50;
	}

	.fab:hover {
		transform: scale(1.1);
	}

	.fab:active {
		transform: scale(0.95);
	}
</style>
