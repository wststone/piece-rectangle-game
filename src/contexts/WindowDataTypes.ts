export interface PanguAPIResponse<T> {
	code: number;
	data: AttachParameter & T;
}
export enum LevelHard {
	"简单",
	"中等",
	"困难"
}

export interface GameInfo {
	gameInfo: GameInfoClass;
	gameStatus: GameStatus;
	rankData: RankData;
	rewardData: RewardData[];
	AttachParameter: AttachParameter;
}

export interface AttachParameter {
	request: Request;
	login_user: LoginUser;
	req_method: string;
	web_env: string;
	api: string;
}

export interface LoginUser {
	id: number;
	uid: number;
	name: string;
	role: string;
}

export interface Request {
	gt_id: string;
	auth_cookie: string;
	use_for: null;
}

export interface GameInfoClass {
	title: string;
	desc: string;
	pic_url: string;
	gt_id: number;
	game_id: number;
	levelData: { [key: string]: LevelData };
	rank_url?: string;
}

export interface LevelData {
	key: string;
	title: string;
	lv_num: number;
	exp_rate: number;
	top_level: number;
}

export interface GameStatus {
	tip: string;
	isOpen: number;
	restTime: number;
}

export interface RankData {
	my_rank: MyRank;
	list: MyRank[];
}

export interface MyRank {
	index: number;
	title: string;
	name: string;
	avator: string;
	total_exp: number;
	total_time: number;
}

export interface RewardData {
	icon: string;
	title: string;
	is_current: number;
	use_icon: number;
	lebi: number;
}

export const TEST_WINDOW_DATA: GameInfo = {
	gameInfo: {
		title: "拼长方形(第1期)",
		desc: "拖动方框组，拼成一个长方形",
		pic_url:
			"https://lx-public.oss-cn-beijing.aliyuncs.com/www/common/game_1.png",
		gt_id: 3,
		game_id: 1,
		levelData: {
			"1": {
				key: "1",
				title: "简单",
				lv_num: 50,
				exp_rate: 1,
				top_level: 7,
			},
			"2": {
				key: "2",
				title: "中等",
				lv_num: 50,
				exp_rate: 2,
				top_level: 0,
			},
			"3": {
				key: "3",
				title: "困难",
				lv_num: 50,
				exp_rate: 3,
				top_level: 0,
			},
		},
	},
	gameStatus: {
		tip: "距离结束:4天14时36分",
		isOpen: 1,
		restTime: 398197,
	},
	rankData: {
		my_rank: {
			index: 1,
			title: "第1名",
			name: "瓮会建",
			avator: "https://test.lexue100.com/avatar.php?uid=20&size=small",
			total_exp: 3,
			total_time: 0,
		},
		list: [
			{
				index: 1,
				title: "第1名",
				name: "瓮会建",
				avator:
					"https://test.lexue100.com/avatar.php?uid=20&size=small",
				total_exp: 3,
				total_time: 0,
			},
		],
	},
	rewardData: [
		{
			icon:
				"https://lx-public.oss-cn-beijing.aliyuncs.com/www/common/rank_1.png",
			title: "冠军",
			is_current: 1,
			use_icon: 1,
			lebi: 20,
		},
		{
			icon:
				"https://lx-public.oss-cn-beijing.aliyuncs.com/www/common/rank_2.png",
			title: "亚军",
			is_current: 1,
			use_icon: 1,
			lebi: 15,
		},
		{
			icon:
				"https://lx-public.oss-cn-beijing.aliyuncs.com/www/common/rank_3.png",
			title: "季军",
			is_current: 1,
			use_icon: 1,
			lebi: 12,
		},
		{
			icon: "",
			title: "4~10名",
			is_current: 1,
			use_icon: 0,
			lebi: 10,
		},
		{
			icon: "",
			title: "11~50名",
			is_current: 1,
			use_icon: 0,
			lebi: 5,
		},
		{
			icon: "",
			title: "51~100名",
			is_current: 1,
			use_icon: 0,
			lebi: 2,
		},
		{
			icon: "",
			title: "101~500名",
			is_current: 1,
			use_icon: 0,
			lebi: 1,
		},
	],
	AttachParameter: {
		request: {
			gt_id: "3",
			auth_cookie:
				"09c4JlgfKRGnmJJ3rKebgr9Xahyj73LNrPyXXeqy85aSxI4VNfszYJ0V8qZ42pzgCcrvPYJYPzUtVsPOH6ZGkv8I",
			use_for: null,
		},
		login_user: {
			id: 20,
			uid: 20,
			name: "瓮会建",
			role: "student",
		},
		req_method: "POST",
		web_env: "test",
		api: "common/computer/game_rank_data",
	},
};
