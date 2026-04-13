export function getTheme(): string {
	if (typeof document === "undefined") return "dark";
	return document.documentElement.getAttribute("data-theme") || "dark";
}

export function setTheme(theme: string): void {
	if (typeof document === "undefined") return;
	document.documentElement.setAttribute("data-theme", theme);
}

export function toggleTheme(): string {
	const current = getTheme();
	const next = current === "dark" ? "light" : "dark";
	setTheme(next);
	return next;
}
