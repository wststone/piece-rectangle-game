import { GRID_SIZE } from "./utils/constants";
import Block from "./Block";

export default class Edge {
	left: number;
	top: number;
	right: number;
	bottom: number;
	block: Block;
	constructor(
		left: number,
		top: number,
		right: number,
		bottom: number,
		block: Block
	) {
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
		this.block = block;
	}
	get isHorizontal(): boolean {
		return this.top === this.bottom;
	}
	get isVertical(): boolean {
		return this.left === this.right;
	}
	get leftLength(): number {
		return this.block.x + this.left * GRID_SIZE;
	}
	get topLength(): number {
		return this.block.y + this.top * GRID_SIZE;
	}
	get rightLength(): number {
		return this.block.x + this.right * GRID_SIZE;
	}
	get bottomLength(): number {
		return this.block.y + this.bottom * GRID_SIZE;
	}
}
