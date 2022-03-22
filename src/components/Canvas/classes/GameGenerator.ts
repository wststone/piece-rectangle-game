import { ILEVELS, DEFAULT_LEVEL, DifficultyName } from "./utils/constants";
import { BLOCK_IMAGE_SRCS } from "../方块";
import { PROBLEMS, SHAPES } from "./utils/block-data";
import Rectangle from "./Rectangle";

interface IGameOptions {
	levelNum: number;
	canvas: HTMLCanvasElement;
}

export default class GameGenerator {
	private Image_List: HTMLImageElement[] = [];
	private LEVEL_DATA: ILEVELS[] | null = null;
	private BGM: HTMLAudioElement = new Audio();
	canvas: HTMLCanvasElement | undefined;
	rectangle: Rectangle | null = null;
	Previous_Rectangle: Rectangle | null = null;
	GAME_LEVEL: ILEVELS = DEFAULT_LEVEL;
	Solution: [number, number][] = [];
	loadingResources: boolean = false;

	get level(): number {
		return this.GAME_LEVEL.levelNum;
	}
	get isWon(): boolean {
		return !!this.rectangle?.blockTogether;
	}

	//Only called once when initiating the canvas
	initGame(options: IGameOptions) {
		this.canvas = options.canvas;
		this.loadLevel(options.levelNum);
	}

	async loadResources() {
		this.loadingResources = true;
		this.LEVEL_DATA = this.parseLevelArray(PROBLEMS, SHAPES);
		await this.getBlockImages();
		this.loadingResources = false;
	}

	private parseLevelArray(
		levelArray: string[],
		shapeArray: string[]
	): ILEVELS[] {
		let levelName: DifficultyName = "简单",
			gameLevelNum: number = 0,
			x: number = 0,
			y: number = 0,
			shapeId: number = 0,
			blockCoordinates: [number, number][] = [],
			blockShapes: [number, number][][] = [];
		const parsedResult = levelArray.map((levelStr, index) => {
			blockCoordinates = [];
			blockShapes = [];
			const infoArray = levelStr.split(";");
			const brickCount = +infoArray[0];
			for (let i = 1; i < infoArray.length; i++) {
				const blockArray = infoArray[i].split(",");
				x = +blockArray[0];
				y = +blockArray[1];
				shapeId = +blockArray[2];
				blockCoordinates.push([x, y]);
				const shapeCordArray = shapeArray[shapeId].split(";");
				const result = shapeCordArray.map(shape => {
					const temp = shape.split(",");
					const temp_arr: [number, number] = [+temp[0], +temp[1]];
					return temp_arr;
				});
				blockShapes.push(result);
			}
			if (index < 50) {
				levelName = "简单";
				gameLevelNum = index;
			} else if (index >= 100) {
				levelName = "困难";
				gameLevelNum = index - 100;
			} else {
				levelName = "中等";
				gameLevelNum = index - 50;
			}

			return {
				levelName,
				levelNum: gameLevelNum,
				totalSquareNum: brickCount,
				totalBlocks: infoArray.length - 1,
				blockShapes: blockShapes,
				blockCoordinates: blockCoordinates,
			};
		});
		return parsedResult;
	}

	private generateSolution(totalSquare: number) {
		this.Solution = [];
		const half = Math.ceil(totalSquare);
		const level_array = Array.from(
			{ length: totalSquare },
			(_, i) => i + 1
		);
		const tempSolutionSet = new Set<string>();
		for (let i = 0; i < totalSquare; i++) {
			const temp = level_array[i];
			if (
				totalSquare % temp === 0 &&
				temp !== 1 &&
				temp !== totalSquare
			) {
				tempSolutionSet.add(`${temp},${totalSquare / temp}`);
				tempSolutionSet.add(`${totalSquare / temp},${temp}`);
				if (temp >= half) break;
			}
		}
		for (const solution of Array.from(tempSolutionSet)) {
			const [x, y] = solution.split(",");
			this.Solution.push([Number(x), Number(y)]);
		}
	}

	loadLevel(level: number) {
		this.GAME_LEVEL = {
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
		this.generateSolution(this.GAME_LEVEL.totalSquareNum);
		this.rectangle = new Rectangle(
			this.canvas!,
			this.Image_List,
			this.GAME_LEVEL.blockCoordinates,
			this.GAME_LEVEL.blockShapes,
			this.Solution
		);
	}

	endGame() {
		if (this.rectangle) this.rectangle.unbindCanvas();
	}

	private async getBlockImages() {
		for (let block in BLOCK_IMAGE_SRCS) {
			const img = await this._loadImage(BLOCK_IMAGE_SRCS[block]);
			this.Image_List.push(img);
		}
	}

	private _loadImage(imgSrc: string): Promise<HTMLImageElement> {
		const temp_img = new Image();
		temp_img.src = imgSrc;
		return new Promise((resolve, reject) => {
			temp_img.onload = () => resolve(temp_img);
			temp_img.onerror = () => reject(() => {});
		});
	}
}
