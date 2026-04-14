function createTheme() {
	let current = $state(
		typeof document !== "undefined"
			? document.documentElement.getAttribute("data-theme") || "dark"
			: "dark",
	);

	function toggle() {
		current = current === "dark" ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", current);
	}

	return {
		get current() {
			return current;
		},
		toggle,
	};
}

export const theme = createTheme();
