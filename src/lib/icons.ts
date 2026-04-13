import type { Component } from "svelte";
import BrainIcon from "~icons/lucide/brain";
import BriefcaseIcon from "~icons/lucide/briefcase";
import CodeIcon from "~icons/lucide/code";
import Gamepad2Icon from "~icons/lucide/gamepad-2";
import UsersIcon from "~icons/lucide/users";

export const iconMap: Record<string, Component> = {
	briefcase: BriefcaseIcon,
	brain: BrainIcon,
	code: CodeIcon,
	users: UsersIcon,
	"gamepad-2": Gamepad2Icon,
};

export const iconOptions: {
	value: string;
	icon: Component | null;
	label: string;
}[] = [
	{ value: "", icon: null, label: "Без иконки" },
	{ value: "briefcase", icon: BriefcaseIcon, label: "Briefcase" },
	{ value: "brain", icon: BrainIcon, label: "Brain" },
	{ value: "code", icon: CodeIcon, label: "Code" },
	{ value: "users", icon: UsersIcon, label: "Users" },
	{ value: "gamepad-2", icon: Gamepad2Icon, label: "Gamepad" },
];
