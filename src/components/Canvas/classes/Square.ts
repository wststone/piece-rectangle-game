import Block from "./Block";

export default class Square {
	xCoordinate: number;
	yCoordinate: number;
	block: Block;
	constructor(x: number, y: number, block: Block) {
		this.xCoordinate = x;
		this.yCoordinate = y;
		this.block = block;
	}
}
