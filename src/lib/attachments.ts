export function closeOnSelectOutside(onclose: () => void) {
	let clickStartedOnOverlay = false;

	function attachment(node: HTMLElement) {
		const handleMouseDown = (e: MouseEvent) => {
			clickStartedOnOverlay = e.target === node;
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (clickStartedOnOverlay && e.target === node) {
				onclose();
			}
			clickStartedOnOverlay = false;
		};

		node.addEventListener("mousedown", handleMouseDown);
		node.addEventListener("mouseup", handleMouseUp);

		return () => {
			node.removeEventListener("mousedown", handleMouseDown);
			node.removeEventListener("mouseup", handleMouseUp);
		};
	}

	return attachment;
}
