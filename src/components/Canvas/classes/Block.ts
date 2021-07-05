import {
	_calculate_left_right_edge,
	_calculate_top_bottom_edge,
} from "./utils/block-edge-helper";
import { GRID_SIZE, X_GRID_NUM, Y_GRID_NUM } from "./utils/constants";
import { IRouteData } from "./Rectangle";
import Square from "./Square";
import Edge from "./Edge";

// +---+---+    例子:
// | X | Y |     X(0,0)  Y(1,0)
// +---+---+
//     | Z |     Z(1,1)
//     +---+
//     | W |     W(1,2) -- 于是这里有四个方格: [[0,0], [1,0], [1,1], [1,2]]
//     +---+	 -- Block Abstraction
export default class Block {
	// 实际值
	x: number;
	y: number;
	// 坐标值
	gridX: number;
	gridY: number;
	//
	xAlign: number = 0;
	yAlign: number = 0;
	squareNum: number;
	squareList: Square[] | null;
	// 水平长/垂直高
	xNum: number = 1;
	yNum: number = 1;
	selected: boolean = false;
	isSource: boolean = false;
	//
	private routeData: IRouteData = {
		uniqueCordSet: new Set<string>(),
		uniqueCordList: [],
		lineToRoutes: [],
		routeStartXY: [0, 0],
	};
	//
	shapeList: [number, number][] = [];
	leftEdges: Edge[] = [];
	rightEdges: Edge[] = [];
	topEdges: Edge[] = [];
	bottomEdges: Edge[] = [];
	image: HTMLImageElement;

	constructor(
		squares: [number, number][],
		image: HTMLImageElement,
		routeData: IRouteData
	) {
		this.x = this.y = 0;
		this.gridX = this.gridY = 0;
		this.image = image;
		this.selected = false;
		this.squareNum = 0;
		this.squareList = null;
		this.shapeList = squares;
		this.routeData = routeData;
		this._setSquares(squares);
	}
	get width(): number {
		return this.xNum * GRID_SIZE;
	}
	get height(): number {
		return this.yNum * GRID_SIZE;
	}
	get maxRightMove(): number {
		const temp_x = (X_GRID_NUM - this.xNum) * GRID_SIZE - this.x;
		return temp_x >= 0 ? temp_x : 0;
	}
	get maxLeftMove(): number {
		return this.x >= 0 ? this.x : 0;
	}
	get maxTopMove(): number {
		return this.y >= 0 ? this.y : 0;
	}
	get maxBottomMove(): number {
		const temp_y = (Y_GRID_NUM - this.yNum) * GRID_SIZE - this.y;
		return temp_y >= 0 ? temp_y : 0;
	}
	private _setSquares(squares: number[][]) {
		this.squareNum = squares.length;
		this.squareList = new Array(this.squareNum);
		for (let i = 0; i < this.squareNum; i++) {
			this.squareList[i] = new Square(squares[i][0], squares[i][1], this);
		}
		let xMax = 0,
			yMax = 0;
		for (const square of this.squareList) {
			if (xMax < square.xCoordinate) xMax = square.xCoordinate;
			if (yMax < square.yCoordinate) yMax = square.yCoordinate;
		}
		// 实际长度、宽度要在坐标上加一
		this.xNum = xMax + 1;
		this.yNum = yMax + 1;
		this._calculateEdges();
	}

	hasSquare(x: number, y: number) {
		for (const square of this.squareList!) {
			if (square.xCoordinate === x && square.yCoordinate === y) {
				return square;
			}
		}
		return;
	}

	moveToGrid(gx: number, gy: number) {
		this.x = gx * GRID_SIZE;
		this.y = gy * GRID_SIZE;
		this.gridX = gx;
		this.gridY = gy;
	}

	drawBlockEdges(ctx: CanvasRenderingContext2D) {
		const [_X, _Y] = this.routeData.routeStartXY;
		ctx.moveTo(_X * GRID_SIZE + this.x, _Y * GRID_SIZE + this.y);
		for (const [routeX, routeY] of this.routeData.lineToRoutes) {
			ctx.lineTo(
				this.x + routeX * GRID_SIZE,
				this.y + routeY * GRID_SIZE
			);
		}
		ctx.stroke();
	}

	alignBlock() {}

	drawBlock(ctx: CanvasRenderingContext2D) {
		ctx.lineWidth = this.selected ? 0.75 : 0.3;
		ctx.strokeStyle = this.selected ? "#C62828" : "#676767";
		ctx.beginPath();
		for (const square of this.squareList!) {
			const x = this.x + square.xCoordinate * GRID_SIZE;
			const y = this.y + square.yCoordinate * GRID_SIZE;
			ctx.drawImage(
				this.image,
				0,
				0,
				this.image.width,
				this.image.height,
				x,
				y,
				GRID_SIZE,
				GRID_SIZE
			);
			// if (!this.selected)
			// 	ctx.strokeRect(
			// 		x,
			// 		y,
			// 		GRID_SIZE,
			// 		GRID_SIZE
			// 	);
		}
		if (this.selected) this.drawBlockEdges(ctx);
	}

	hitTest(x: number, y: number) {
		const gx = Math.floor((x - this.x) / GRID_SIZE);
		const gy = Math.floor((y - this.y) / GRID_SIZE);
		if (gx < 0 || gx >= this.xNum || gy < 0 || gy >= this.yNum) {
			return false;
		}
		for (const square of this.squareList!) {
			if (square.xCoordinate === gx && square.yCoordinate === gy) {
				return true;
			}
		}
		return false;
	}

	alignToGrid(x: number, y: number) {
		let gx = Math.floor((x + GRID_SIZE / 2) / GRID_SIZE);
		let gy = Math.floor((y + GRID_SIZE / 2) / GRID_SIZE);
		if (gx < 0) gx = 0;
		else if (gx > X_GRID_NUM - this.xNum) gx = X_GRID_NUM - this.xNum;
		if (gy < 0) gy = 0;
		else if (gy > Y_GRID_NUM - this.yNum) gy = Y_GRID_NUM - this.yNum;
		this.xAlign = gx;
		this.yAlign = gy;
	}

	private _calculateEdges() {
		_calculate_left_right_edge(this);
		_calculate_top_bottom_edge(this);
	}
}
