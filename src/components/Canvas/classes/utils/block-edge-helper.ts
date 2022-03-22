import Square from "../Square";
import Edge from "../Edge";
import Block from "../Block";

export function _calculate_left_right_edge(self: Block) {
	function sortVertical(s1: Square, s2: Square) {
		if (s1.xCoordinate < s2.xCoordinate) return -1;
		else if (s1.xCoordinate > s2.xCoordinate) return 1;
		if (s1.yCoordinate < s2.yCoordinate) return -1;
		else if (s1.yCoordinate > s2.yCoordinate) return 1;
		return 0;
	}
	let leftSquares: Square[] = [],
		rightSquares: Square[] = [];
	// 查看该图形块下的每个块的左右是否有也有块
	for (const square of self.squareList!) {
		if (!self.hasSquare(square.xCoordinate - 1, square.yCoordinate)) {
			leftSquares.push(square);
		}
		if (!self.hasSquare(square.xCoordinate + 1, square.yCoordinate)) {
			rightSquares.push(square);
		}
	}
	leftSquares.sort(sortVertical);
	rightSquares.sort(sortVertical);

	let leftEdge: Edge[] = [],
		rightEdge: Edge[] = [],
		temp_edge: Edge | null = null,
		previousSquare: Square | null = null;
	for (const square of leftSquares) {
		if (
			previousSquare !== null &&
			previousSquare.xCoordinate === square.xCoordinate &&
			previousSquare.yCoordinate + 1 === square.yCoordinate
		) {
			temp_edge!.bottom++;
		} else {
			temp_edge = new Edge(
				square.xCoordinate,
				square.yCoordinate,
				square.xCoordinate,
				square.yCoordinate + 1,
				self
			);
			leftEdge.push(temp_edge);
		}
		previousSquare = square;
	}
	self.leftEdges = leftEdge;

	// reset
	temp_edge = null;
	previousSquare = null;
	for (const square of rightSquares) {
		if (
			previousSquare !== null &&
			previousSquare.xCoordinate === square.xCoordinate &&
			previousSquare.yCoordinate + 1 === square.yCoordinate
		) {
			temp_edge!.bottom++;
		} else {
			temp_edge = new Edge(
				square.xCoordinate + 1,
				square.yCoordinate,
				square.xCoordinate + 1,
				square.yCoordinate + 1,
				self
			);
			rightEdge.push(temp_edge);
		}
		previousSquare = square;
	}
	self.rightEdges = rightEdge;
}

export function _calculate_top_bottom_edge(self: Block) {
	function sortHorizontal(s1: Square, s2: Square) {
		if (s1.yCoordinate < s2.yCoordinate) return -1;
		else if (s1.yCoordinate > s2.yCoordinate) return 1;
		if (s1.xCoordinate < s2.xCoordinate) return -1;
		else if (s1.xCoordinate > s2.xCoordinate) return 1;
		return 0;
	}

	let topSquares: Square[] = [],
		bottomSquares: Square[] = [];
	for (const square of self.squareList!) {
		if (!self.hasSquare(square.xCoordinate, square.yCoordinate - 1)) {
			topSquares.push(square);
		}
		if (!self.hasSquare(square.xCoordinate, square.yCoordinate + 1)) {
			bottomSquares.push(square);
		}
	}
	topSquares.sort(sortHorizontal);
	bottomSquares.sort(sortHorizontal);

	let topEdge: Edge[] = [],
		bottomEdge: Edge[] = [],
		temp_edge: Edge | null = null,
		previousSquare: Square | null = null;
	for (let i = 0; i < topSquares.length; i++) {
		const square = topSquares[i];
		if (
			previousSquare !== null &&
			previousSquare.xCoordinate + 1 === square.xCoordinate &&
			previousSquare.yCoordinate === square.yCoordinate
		) {
			temp_edge!.right++;
		} else {
			temp_edge = new Edge(
				square.xCoordinate,
				square.yCoordinate,
				square.xCoordinate + 1,
				square.yCoordinate,
				self
			);
			topEdge.push(temp_edge);
		}
		previousSquare = square;
	}
	self.topEdges = topEdge;

	temp_edge = null;
	previousSquare = null;
	for (const square of bottomSquares) {
		if (
			previousSquare !== null &&
			previousSquare.xCoordinate + 1 === square.xCoordinate &&
			previousSquare.yCoordinate === square.yCoordinate
		) {
			temp_edge!.right++;
		} else {
			temp_edge = new Edge(
				square.xCoordinate,
				square.yCoordinate + 1,
				square.xCoordinate + 1,
				square.yCoordinate + 1,
				self
			);
			bottomEdge.push(temp_edge);
		}
		previousSquare = square;
	}
	self.bottomEdges = bottomEdge;
}
