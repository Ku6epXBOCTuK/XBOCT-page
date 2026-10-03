import type { Component } from "svelte";
import ArchiveIcon from "~icons/lucide/archive";
import BookOpenIcon from "~icons/lucide/book-open";
import BookmarkIcon from "~icons/lucide/bookmark";
import BotIcon from "~icons/lucide/bot";
import BrainIcon from "~icons/lucide/brain";
import BriefcaseIcon from "~icons/lucide/briefcase";
import BugIcon from "~icons/lucide/bug";
import CalendarIcon from "~icons/lucide/calendar";
import CameraIcon from "~icons/lucide/camera";
import CloudIcon from "~icons/lucide/cloud";
import CodeIcon from "~icons/lucide/code";
import CoffeeIcon from "~icons/lucide/coffee";
import CoinsIcon from "~icons/lucide/coins";
import DatabaseIcon from "~icons/lucide/database";
import DumbbellIcon from "~icons/lucide/dumbbell";
import FileTextIcon from "~icons/lucide/file-text";
import FilmIcon from "~icons/lucide/film";
import FlaskConicalIcon from "~icons/lucide/flask-conical";
import FolderIcon from "~icons/lucide/folder";
import Gamepad2Icon from "~icons/lucide/gamepad-2";
import GiftIcon from "~icons/lucide/gift";
import GitBranchIcon from "~icons/lucide/git-branch";
import GlobeIcon from "~icons/lucide/globe";
import GraduationCapIcon from "~icons/lucide/graduation-cap";
import HammerIcon from "~icons/lucide/hammer";
import HeadphonesIcon from "~icons/lucide/headphones";
import HeartIcon from "~icons/lucide/heart";
import HomeIcon from "~icons/lucide/home";
import ImageIcon from "~icons/lucide/image";
import KeyIcon from "~icons/lucide/key";
import LinkIcon from "~icons/lucide/link";
import MailIcon from "~icons/lucide/mail";
import MapPinIcon from "~icons/lucide/map-pin";
import MessageCircleIcon from "~icons/lucide/message-circle";
import MusicIcon from "~icons/lucide/music";
import NewspaperIcon from "~icons/lucide/newspaper";
import PaletteIcon from "~icons/lucide/palette";
import PenToolIcon from "~icons/lucide/pen-tool";
import PlaneIcon from "~icons/lucide/plane";
import RocketIcon from "~icons/lucide/rocket";
import RssIcon from "~icons/lucide/rss";
import SendIcon from "~icons/lucide/send";
import ServerIcon from "~icons/lucide/server";
import ShieldIcon from "~icons/lucide/shield";
import ShoppingCartIcon from "~icons/lucide/shopping-cart";
import SparklesIcon from "~icons/lucide/sparkles";
import StarIcon from "~icons/lucide/star";
import TerminalIcon from "~icons/lucide/terminal";
import TrendingUpIcon from "~icons/lucide/trending-up";
import TrophyIcon from "~icons/lucide/trophy";
import TvIcon from "~icons/lucide/tv";
import TwitchIcon from "~icons/lucide/twitch";
import UsersIcon from "~icons/lucide/users";
import WalletIcon from "~icons/lucide/wallet";
import WrenchIcon from "~icons/lucide/wrench";
import YoutubeIcon from "~icons/lucide/youtube";
import ZapIcon from "~icons/lucide/zap";

export const iconMap: Record<string, Component> = {
	archive: ArchiveIcon,
	"book-open": BookOpenIcon,
	bookmark: BookmarkIcon,
	bot: BotIcon,
	brain: BrainIcon,
	briefcase: BriefcaseIcon,
	bug: BugIcon,
	calendar: CalendarIcon,
	camera: CameraIcon,
	cloud: CloudIcon,
	code: CodeIcon,
	coffee: CoffeeIcon,
	coins: CoinsIcon,
	database: DatabaseIcon,
	dumbbell: DumbbellIcon,
	"file-text": FileTextIcon,
	film: FilmIcon,
	"flask-conical": FlaskConicalIcon,
	folder: FolderIcon,
	"gamepad-2": Gamepad2Icon,
	gift: GiftIcon,
	"git-branch": GitBranchIcon,
	globe: GlobeIcon,
	"graduation-cap": GraduationCapIcon,
	hammer: HammerIcon,
	headphones: HeadphonesIcon,
	heart: HeartIcon,
	home: HomeIcon,
	image: ImageIcon,
	key: KeyIcon,
	link: LinkIcon,
	mail: MailIcon,
	"map-pin": MapPinIcon,
	"message-circle": MessageCircleIcon,
	music: MusicIcon,
	newspaper: NewspaperIcon,
	palette: PaletteIcon,
	"pen-tool": PenToolIcon,
	plane: PlaneIcon,
	rocket: RocketIcon,
	rss: RssIcon,
	send: SendIcon,
	server: ServerIcon,
	shield: ShieldIcon,
	"shopping-cart": ShoppingCartIcon,
	sparkles: SparklesIcon,
	star: StarIcon,
	terminal: TerminalIcon,
	"trending-up": TrendingUpIcon,
	trophy: TrophyIcon,
	tv: TvIcon,
	twitch: TwitchIcon,
	users: UsersIcon,
	wallet: WalletIcon,
	wrench: WrenchIcon,
	youtube: YoutubeIcon,
	zap: ZapIcon,
};

export const iconOptions: {
	value: string;
	icon: Component | null;
	label: string;
}[] = [
	{ value: "", icon: null, label: "Без иконки" },
	...Object.entries(iconMap).map(([value, icon]) => ({
		value,
		icon,
		label: value,
	})),
];
