export function logMouseEvent(e: MouseEvent, phase: string) {
	const target = e.target as HTMLElement;
	const currentTarget = e.currentTarget as HTMLElement;
	console.log(`[Mouse ${phase}]`, {
		target: target?.tagName,
		targetId: target?.id,
		targetClass: target?.className?.slice(0, 30),
		currentTarget: currentTarget?.tagName,
		currentTargetId: currentTarget?.id,
		screenX: e.screenX,
		screenY: e.screenY,
		clientX: e.clientX,
		clientY: e.clientY,
	});
}
