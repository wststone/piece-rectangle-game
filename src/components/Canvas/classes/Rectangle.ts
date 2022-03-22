import Block from "./Block";
import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_SIZE } from "./utils/constants";
import {
	_resetMovingSource,
	_applyMove,
	_getMaxTopMoveDist,
	_getMaxBottomMoveDist,
	_getBlockTopMinDist,
	_getBlockBottomMinDist,
	_getBlockRightMinDist,
	_getBlockLeftMinDist,
} from "./utils/move-helper";

export interface ITouchData {
	currentBlock: Block;
	xEnd: number;
	yEnd: number;
}

export interface IRouteData {
	uniqueCordSet: Set<string>;
	uniqueCordList: [number, number][];
	lineToRoutes: [number, number][];
	routeStartXY: [number, number];
}

export default class Rectangle {
	private shapeLists: [number, number][][];
	private left: number = 0;
	private top: number = 0;
	private right: number = 0;
	private bottom: number = 0;
	blockList: Block[];
	movingBlockList: Block[];
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	blockCoordinates: [number, number][];
	//
	canvasBackgroundImage: HTMLImageElement | null = null;
	imageList: HTMLImageElement[];
	solutionArray: [number, number][];
	blockRoutesData: IRouteData[] = [];
	//canvas moving data
	touchData: ITouchData | null;
	objX: number = 0;
	objY: number = 0;
	blockTogether: boolean = false;
	get width(): number {
		return this.right - this.left;
	}
	get height(): number {
		return this.bottom - this.top;
	}

	constructor(
		canvas: HTMLCanvasElement,
		imageList: HTMLImageElement[],
		blockCoordinates: [number, number][],
		blockShapes: [number, number][][],
		solutionArray: [number, number][]
	) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d")!;
		this.blockList = [];
		this.touchData = null;
		this.movingBlockList = [];
		this.imageList = imageList;
		this.blockCoordinates = blockCoordinates;
		this.shapeLists = blockShapes;
		this.solutionArray = solutionArray;
		this.init();
	}

	init() {
		this.bindCanvas();
		this.getAllEdgeRoutes();
		this.shuffleImageList();
		this.generateBlocks();
		this.drawBlocks();
	}

	shuffleImageList() {
		let randomIndex: number = 0,
			randomImage: HTMLImageElement;
		for (let i = this.imageList.length - 1; i > 0; i--) {
			randomIndex = Math.floor(Math.random() * (i + 1));
			randomImage = this.imageList[i];
			this.imageList[i] = this.imageList[randomIndex];
			this.imageList[randomIndex] = randomImage;
		}
	}

	private generateBlocks() {
		for (let i = 0; i < this.shapeLists.length; i++) {
			const shape = this.shapeLists[i];
			const block = new Block(
				shape,
				this.imageList[i],
				this.blockRoutesData[i]
			);
			const [blockX, blockY] = this.blockCoordinates[i];
			block.moveToGrid(blockX, blockY);
			this.blockList.push(block);
		}
	}

	private getAllMovesXY(shapeList: [number, number][]) {
		const uniqueCordSet = new Set<string>();
		const uniqueCordList: [number, number][] = [];
		for (const [x, y] of shapeList) {
			uniqueCordSet.add(`${x},${y}`);
			uniqueCordSet.add(`${x + 1},${y}`);
			uniqueCordSet.add(`${x},${y + 1}`);
			uniqueCordSet.add(`${x + 1},${y + 1}`);
		}
		for (const cord of Array.from(uniqueCordSet)) {
			const [_str1, _str2] = cord.split(",");
			if (
				uniqueCordSet.has(`${+_str1 - 1},${+_str2 - 1}`) &&
				uniqueCordSet.has(`${+_str1 - 1},${+_str2 + 1}`) &&
				uniqueCordSet.has(`${+_str1 + 1},${+_str2 - 1}`) &&
				uniqueCordSet.has(`${+_str1 + 1},${+_str2 + 1}`)
			) {
				uniqueCordSet.delete(`${_str1},${_str2}`);
			} else uniqueCordList.push([+_str1, +_str2]);
		}

		return { uniqueCordSet, uniqueCordList };
	}

	/**
	 *
	 *   0---@---@		$	@---@
	 *	 | X | Y |    		|	|
	 *	 @---@---@		0---@---@
	 *	     | Z |    	|	|	|
	 *	     @---@		@---@---@
	 *	     | W |
	 *	     @---@
	 * -starting from 0 in graph which maps to => (_startX, _startY)
	 * -added edge-case for square where the center cannot be reached
	 * @returns - {routeStartXY ,uniqueCordList, uniqueCordSet, lineToRoutes}
	 */
	private getAllEdgeRoutes() {
		for (const shapeList of this.shapeLists) {
			let tempX: number = 0,
				tempY: number = 0,
				keepMoving: boolean = true;
			const lineToRoutes: [number, number][] = [];
			const { uniqueCordSet, uniqueCordList } =
				this.getAllMovesXY(shapeList);
			const routeStartXY = uniqueCordList[0];
			const [startX, startY] = routeStartXY;

			// Down
			const moveDown = () => {
				if (
					uniqueCordSet.has(`${startX + tempX},${startY + tempY + 1}`)
				) {
					uniqueCordSet.delete(
						`${startX + tempX},${startY + tempY + 1}`
					);
					lineToRoutes.push([startX + tempX, startY + tempY + 1]);
					tempY++;
					keepMoving = false;
				} else keepMoving = true;
			};
			// Right
			const moveRight = () => {
				if (
					uniqueCordSet.has(`${startX + tempX + 1},${startY + tempY}`)
				) {
					uniqueCordSet.delete(
						`${startX + tempX + 1},${startY + tempY}`
					);
					lineToRoutes.push([startX + tempX + 1, startY + tempY]);
					tempX++;
					keepMoving = false;
				} else keepMoving = true;
			};
			// Up
			const moveUp = () => {
				if (
					uniqueCordSet.has(`${startX + tempX},${startY + tempY - 1}`)
				) {
					uniqueCordSet.delete(
						`${startX + tempX},${startY + tempY - 1}`
					);
					lineToRoutes.push([startX + tempX, startY + tempY - 1]);
					tempY--;
					keepMoving = false;
				} else keepMoving = true;
			};
			// Left
			const moveLeft = () => {
				if (
					uniqueCordSet.has(`${startX + tempX - 1},${startY + tempY}`)
				) {
					uniqueCordSet.delete(
						`${startX + tempX - 1},${startY + tempY}`
					);
					lineToRoutes.push([startX + tempX - 1, startY + tempY]);
					tempX--;
					keepMoving = false;
				} else keepMoving = true;
			};

			loop1: while (true) {
				while (true) {
					moveDown();
					if (!keepMoving) break;
					moveRight();
					if (!keepMoving) break;
					moveUp();
					if (!keepMoving) break;
					moveLeft();
					if (uniqueCordSet.size === 0) {
						break loop1;
					}
				}
			}
			this.blockRoutesData.push({
				routeStartXY,
				uniqueCordList,
				uniqueCordSet,
				lineToRoutes,
			});
		}
	}

	alignWhileMoving(slowMax: number = 1.5, slowMin: number = 0.5) {
		for (const block of this.movingBlockList) {
			const alignX = Math.round(block.x / GRID_SIZE) * GRID_SIZE;
			const alignY = Math.round(block.y / GRID_SIZE) * GRID_SIZE;
			const absX = Math.abs(alignX - block.x);
			const absY = Math.abs(alignY - block.y);
			if (absX < slowMax && absX > slowMin) block.x = alignX;
			if (absY < slowMax && absY > slowMin) block.y = alignY;
		}
	}

	drawBlocks() {
		this.clearCanvas();
		this.drawCanvasBackground();
		for (const block of this.blockList) {
			block.drawBlock(this.context);
		}
	}

	private drawCanvasBackground() {
		if (!this.canvasBackgroundImage) {
			this.drawCanvasGridWithRadius();
			const backgroundSrc = this.canvas.toDataURL();
			this.canvasBackgroundImage = new Image();
			this.canvasBackgroundImage.src = backgroundSrc;
		} else this.context.drawImage(this.canvasBackgroundImage, 0, 0);
	}

	private drawRectWithBorderRadius(
		x: number,
		y: number,
		width: number,
		height: number,
		borderRadius: number = 5
	) {
		this.context.beginPath();
		this.context.moveTo(x + borderRadius, y);
		this.context.lineTo(x + width - borderRadius, y);
		this.context.quadraticCurveTo(
			x + width,
			y,
			x + width,
			y + borderRadius
		);
		this.context.lineTo(x + width, y + height - borderRadius);
		this.context.quadraticCurveTo(
			x + width,
			y + height,
			x + width - borderRadius,
			y + height
		);
		this.context.lineTo(x + borderRadius, y + height);
		this.context.quadraticCurveTo(
			x,
			y + height,
			x,
			y + height - borderRadius
		);
		this.context.lineTo(x, y + borderRadius);
		this.context.quadraticCurveTo(x, y, x + borderRadius, y);
		this.context.closePath();
		this.context.stroke();
	}

	drawCanvasGridWithRadius() {
		this.context.imageSmoothingEnabled = false;
		this.context.beginPath();
		this.context.lineWidth = 1.2;
		this.context.strokeStyle = "#4D5479";
		for (let i = 0; i < CANVAS_HEIGHT; i += GRID_SIZE) {
			for (let k = 0; k < CANVAS_WIDTH; k += GRID_SIZE) {
				this.drawRectWithBorderRadius(k, i, GRID_SIZE, GRID_SIZE);
			}
		}
		this.context.stroke();
	}

	drawCanvasGrid() {
		this.context.imageSmoothingEnabled = false;
		this.context.beginPath();
		this.context.lineWidth = 1.2;
		this.context.strokeStyle = "#4D5479";
		for (let i = GRID_SIZE; i < CANVAS_WIDTH; i += GRID_SIZE) {
			this.context.moveTo(i, 0);
			this.context.lineTo(i, CANVAS_HEIGHT);
		}
		for (let i = GRID_SIZE; i < CANVAS_HEIGHT; i += GRID_SIZE) {
			this.context.moveTo(0, i);
			this.context.lineTo(CANVAS_WIDTH, i);
		}
		this.context.stroke();
	}

	private attemptMoveTop(dist: number): number {
		const maxMove = _getMaxTopMoveDist(this);
		if (maxMove === 0) return -1;
		if (dist > maxMove) dist = maxMove; //最多只能移的值
		let minDist: number = 99999,
			minBlocks: Block[] = [];
		_resetMovingSource(this);
		for (const block of this.blockList) {
			if (block.isSource) continue;
			const mm = _getBlockTopMinDist(this, block);
			if (mm < minDist) {
				minDist = mm;
				minBlocks = [block];
			} else if (mm === minDist) {
				minBlocks.push(block);
			}
		}
		if (dist < minDist) {
			_applyMove(this.movingBlockList, 0, -dist);
			return dist;
		}
		_applyMove(this.movingBlockList, 0, -minDist);
		this.movingBlockList.push(...minBlocks);
		return minDist;
	}

	private attemptMoveBottom(dist: number) {
		const maxMove = _getMaxBottomMoveDist(this);
		if (maxMove === 0) return -1;
		if (dist > maxMove) dist = maxMove; //最多只能移的值
		let minDist: number = 99999,
			minBlocks: Block[] = [];
		_resetMovingSource(this);
		for (const block of this.blockList) {
			if (block.isSource) continue;
			const mm = _getBlockBottomMinDist(this, block);
			if (mm < minDist) {
				minDist = mm;
				minBlocks = [block];
			} else if (mm === minDist) {
				minBlocks.push(block);
			}
		}
		if (dist < minDist) {
			_applyMove(this.movingBlockList, 0, dist);
			return dist;
		}
		_applyMove(this.movingBlockList, 0, minDist);
		this.movingBlockList.push(...minBlocks);
		return minDist;
	}

	private attemptMoveLeft(dist: number) {
		let maxMove: number = 99999;
		for (const movingBlock of this.movingBlockList) {
			const _mm = movingBlock.maxLeftMove;
			if (_mm < maxMove) maxMove = _mm;
		}

		if (maxMove === 0) return -1;
		if (dist > maxMove) dist = maxMove; //最多只能移的值
		let minDist = 99999,
			minBlocks: Block[] = [];
		_resetMovingSource(this);
		for (const block of this.blockList) {
			if (block.isSource) continue;
			const mm = _getBlockLeftMinDist(this, block);
			if (mm < minDist) {
				minDist = mm;
				minBlocks = [block];
			} else if (mm === minDist) {
				minBlocks.push(block);
			}
		}
		if (dist < minDist) {
			_applyMove(this.movingBlockList, -dist, 0);
			return dist;
		}
		_applyMove(this.movingBlockList, -minDist, 0);
		this.movingBlockList.push(...minBlocks);
		return minDist;
	}

	private attemptMoveRight(dist: number) {
		let maxMove: number = 99999;
		for (const movingBlock of this.movingBlockList) {
			const _mm = movingBlock.maxRightMove;
			if (_mm < maxMove) maxMove = _mm;
		}
		if (maxMove === 0) return -1;
		if (dist > maxMove) dist = maxMove;

		let minDist = 99999,
			minBlocks: Block[] = [];
		_resetMovingSource(this);
		for (const block of this.blockList) {
			if (block.isSource) continue;
			const mm = _getBlockRightMinDist(this, block);
			if (mm < minDist) {
				minDist = mm;
				minBlocks = [block];
			} else if (mm === minDist) {
				minBlocks.push(block);
			}
		}
		if (dist < minDist) {
			_applyMove(this.movingBlockList, dist, 0);
			return dist;
		}
		_applyMove(this.movingBlockList, minDist, 0);
		this.movingBlockList.push(...minBlocks);
		return minDist;
	}

	private touchStartWrapper = (e: TouchEvent) => this._canvasTouchStart(e);
	private touchMoveWrapper = (e: TouchEvent) => this._canvasTouchMove(e);
	private touchEndWrapper = (e: TouchEvent) => this._canvasTouchEnd(e);

	bindCanvas() {
		this.canvas.addEventListener("touchstart", this.touchStartWrapper);
		this.canvas.addEventListener("touchmove", this.touchMoveWrapper);
		this.canvas.addEventListener("touchend", this.touchEndWrapper);
	}

	getHitBlock(x: number, y: number) {
		for (const block of this.blockList) {
			if (block.hitTest(x, y)) {
				return block;
			}
		}
		return null;
	}

	moveBlocks() {
		if (this.touchData) {
			let relX: number = Math.round(this.objX - this.touchData.xEnd);
			let relY: number = Math.round(this.objY - this.touchData.yEnd);
			this.movingBlockList = [this.touchData.currentBlock];

			if (relX > 0) {
				while (true) {
					const ret = this.attemptMoveRight(relX);
					if (ret < 0) break;
					relX -= ret;
					if (relX <= 0) break;
				}
			} else if (relX < 0) {
				while (true) {
					const ret = this.attemptMoveLeft(-relX);
					if (ret < 0) break;
					relX += ret;
					if (relX >= 0) break;
				}
			}

			if (relY > 0) {
				while (true) {
					const ret = this.attemptMoveBottom(relY);
					if (ret < 0) break;
					relY -= ret;
					if (relY <= 0) break;
				}
			} else if (relY < 0) {
				while (true) {
					const ret = this.attemptMoveTop(-relY);
					if (ret < 0) break;
					relY += ret;
					if (relY >= 0) break;
				}
			}
		}
	}

	private checkGameWon(
		solutionList: [number, number][],
		widthHeight: [number, number],
		onGameWon?: () => void
	): boolean {
		const [width, height] = widthHeight;
		for (const [_width, _height] of solutionList) {
			if (_width === width && _height === height) {
				onGameWon && onGameWon();
				return true;
			}
		}
		return false;
	}

	private _setTouchPosition(e: TouchEvent) {
		let offsetLeft: number = 0,
			offsetTop: number = 0,
			element: HTMLElement = e.targetTouches[0].target as HTMLElement;
		while (element !== null) {
			offsetLeft += element.offsetLeft;
			offsetTop += element.offsetTop;
			element = element.offsetParent as HTMLElement;
		}
		this.objX = e.touches[0].clientX + window.pageXOffset - offsetLeft;
		this.objY = e.touches[0].clientY + window.pageYOffset - offsetTop;
	}

	private _canvasTouchStart(e: TouchEvent) {
		this._setTouchPosition(e);
		const block = this.getHitBlock(this.objX, this.objY);
		if (!block) {
			this.touchData = null;
			return;
		}
		this.touchData = {
			currentBlock: block,
			xEnd: this.objX,
			yEnd: this.objY,
		};
		this.movingBlockList = [];
		block.selected = true;
		this.drawBlocks();
	}

	private _canvasTouchMove(e: TouchEvent) {
		if (this.touchData) {
			this._setTouchPosition(e);

			this.moveBlocks();
			this.alignWhileMoving();
			this.drawBlocks();
			this.touchData.xEnd = this.objX;
			this.touchData.yEnd = this.objY;
		}
	}

	private _canvasTouchEnd(e: TouchEvent) {
		if (this.touchData) {
			this.touchData.currentBlock.selected = false;
			for (const block of this.blockList) {
				block.alignToGrid(block.x, block.y); // 计算对齐到栅格
				block.moveToGrid(block.xAlign, block.yAlign); // 实际对齐到栅格.
			}
			const maxX = Math.max(
				...this.blockList.map(block => block.gridX + block.xNum)
			);
			const minX = Math.min(...this.blockList.map(block => block.gridX));
			const maxY = Math.max(
				...this.blockList.map(block => block.gridY + block.yNum)
			);
			const minY = Math.min(...this.blockList.map(block => block.gridY));
			this.blockTogether = this.checkGameWon(this.solutionArray, [
				maxX - minX, //width
				maxY - minY, //height
			]);

			this.touchData = null;
			this.movingBlockList = [];
			this.drawBlocks();
		}
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	unbindCanvas() {
		this.canvas.removeEventListener("touchstart", this.touchStartWrapper);
		this.canvas.removeEventListener("touchmove", this.touchMoveWrapper);
		this.canvas.removeEventListener("touchend", this.touchEndWrapper);
	}
}
