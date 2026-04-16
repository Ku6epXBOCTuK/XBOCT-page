export function logMouseEvent(e: MouseEvent, phase: string) {
	const target = e.target as HTMLElement | HTMLImageElement | SVGElement;
	const currentTarget = e.currentTarget as HTMLElement;
	const className = target?.className?.baseVal ?? target?.className;
	const targetClass = className?.slice(0, 30);
	console.log(`[Mouse ${phase}]`, {
		target: target?.tagName,
		targetId: target?.id,
		targetClass,
		currentTarget: currentTarget?.tagName,
		currentTargetId: currentTarget?.id,
		screenX: e.screenX,
		screenY: e.screenY,
		clientX: e.clientX,
		clientY: e.clientY,
	});
}
