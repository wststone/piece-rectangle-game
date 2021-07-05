/**
 * @param {number} - The Minimum Number of Grid Block in Canvas
 * @returns - Number of X/Y Axis Grid Number, Canvas Size and Grid Size
 */
function getCanvasSizeInfo() {
	const X_GRID_NUM = window.innerWidth > 450 ? 13 : 9;
	const temp_width = Math.round(window.innerWidth * 0.8);
	const temp_height = Math.round(window.innerHeight * 0.6);
	const sreen_ratio = Math.round((temp_height / temp_width) * 10) / 10;
	const Y_GRID_NUM = Math.round(X_GRID_NUM * sreen_ratio);
	const GRID_SIZE = Math.floor(temp_width / X_GRID_NUM);

	const val = {
		X_GRID_NUM,
		Y_GRID_NUM,
		GRID_SIZE,
		CANVAS_WIDTH: GRID_SIZE * X_GRID_NUM,
		CANVAS_HEIGHT: GRID_SIZE * Y_GRID_NUM,
	};
	return val;
}

// DYNAMIC
export const {
	X_GRID_NUM,
	Y_GRID_NUM,
	GRID_SIZE,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
} = getCanvasSizeInfo();

// export const BLOCK_COLOR_MAP = {
// 	pink: "#FF8FA0",
// 	"light-orange": "#FFAA86",
// 	"light-yellow": "#FFE48A",
// 	"light-green": "#7AD699",
// 	"light-blue": "#7FCBFF",
// 	"light-purple": "#8989FF",
// 	"extra-light-purple": "#C6C0FF",
// 	"purple-pink": "#D97BED",
// 	"blue-green": "#82F6DE",
// 	"green-yellow": "#CEE388",
// 	"green-white": "#D9EDDA",
// 	"light-brown": "#B29D8F",
// 	"light-pink": "#E6A5DD",
// };

export type DifficultyName = "简单" | "中等" | "困难";

export interface ILEVELS {
	levelName: DifficultyName;
	levelNum: number;
	totalSquareNum: number;
	totalBlocks: number;
	blockCoordinates: [number, number][];
	blockShapes: [number, number][][];
}

export const DEFAULT_LEVEL: ILEVELS = {
	levelName: "简单",
	levelNum: 1,
	totalSquareNum: 16,
	totalBlocks: 5,
	blockCoordinates: [
		[3, 6],
		[0, 0],
		[0, 4],
		[7, 4],
		[4, 6],
	],
	blockShapes: [
		[
			[0, 0],
			[0, 1],
			[1, 1],
			[2, 1],
		],
		[
			[0, 0],
			[1, 0],
			[2, 0],
		],
		[
			[0, 1],
			[0, 2],
			[1, 1],
			[2, 0],
			[2, 1],
		],
		[
			[0, 0],
			[0, 1],
		],
		[
			[0, 0],
			[1, 0],
		],
	],
};
