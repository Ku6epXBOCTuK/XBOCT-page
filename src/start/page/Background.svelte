<script lang="ts">
</script>

<div class="background">
	<div class="glow glow-primary"></div>
	<div class="glow glow-secondary"></div>
	<div class="texture"></div>
</div>

<style>
	.background {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.glow {
		position: absolute;
		border-radius: 9999px;
		filter: blur(100px);
	}

	.glow-primary {
		top: 0;
		right: 0;
		width: 40%;
		height: 40%;
		background: var(--primary);
		opacity: 0.05;
	}

	.glow-secondary {
		bottom: 0;
		left: 0;
		width: 30%;
		height: 30%;
		background: var(--secondary);
		opacity: 0.05;
	}

	.texture {
		position: absolute;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
		opacity: 0.03;
		mix-blend-mode: overlay;
	}
</style>
