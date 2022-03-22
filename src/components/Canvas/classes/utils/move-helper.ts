import Block from "../Block";
import Rectangle from "../Rectangle";

export function _applyMove(blocks: Block[], dx: number, dy: number): void {
	// #缓冲作用
	if (dx || dy) {
		let moveX = dx > 6 ? dx - 2 : dx;
		moveX = dx < -6 ? dx + 2 : dx
		let moveY = dy > 6 ? dy - 2 : dy;
		moveY = dy < -6 ? dy + 2 : dy;
		for (const block of blocks) {
			block.x += moveX;
			block.y += moveY;
		}
	}
}

export function _resetMovingSource(self: Rectangle): void {
	self.blockList.map(block => {
		block.isSource = false;
		return block;
	});
	self.movingBlockList.map(block => {
		block.isSource = true;
		return block;
	});
}

export function _getMaxTopMoveDist(self: Rectangle): number {
	let maxMove: number = 99999;
	for (const block of self.movingBlockList) {
		let mm = block.maxTopMove;
		if (mm < maxMove) maxMove = mm;
	}
	return maxMove;
}

export function _getMaxBottomMoveDist(self: Rectangle): number {
	let maxMove: number = 99999;
	for (const block of self.movingBlockList) {
		let mm = block.maxBottomMove;
		if (mm < maxMove) maxMove = mm;
	}
	return maxMove;
}

//sourceblock上边界到destBlock下边界的距离
function _srcToDestTopDist(srcBlock: Block, destBlock: Block): number {
	let dist = 99999;
	for (const edge1 of srcBlock.topEdges) {
		for (const edge2 of destBlock.bottomEdges) {
			if (edge1.topLength < edge2.bottomLength) continue;
			if (edge1.rightLength <= edge2.leftLength) continue;
			if (edge1.leftLength >= edge2.rightLength) continue;
			const temp_dist = edge1.topLength - edge2.bottomLength;
			if (temp_dist < dist) dist = temp_dist;
			if (dist === 0) return 0;
		}
	}
	return dist;
}

export function _getBlockTopMinDist(self: Rectangle, destBlock: Block): number {
	let dist: number = 99999;
	for (const movingBlock of self.movingBlockList) {
		const _dist = _srcToDestTopDist(movingBlock, destBlock);
		if (_dist < dist) dist = _dist;
		if (dist === 0) return 0;
	}
	return dist;
}

function _srcToDestBottomDist(srcBlock: Block, destBlock: Block): number {
	let dist = 99999;
	for (const edge1 of srcBlock.bottomEdges) {
		for (const edge2 of destBlock.topEdges) {
			if (edge1.bottomLength > edge2.topLength) continue;
			if (edge1.rightLength <= edge2.leftLength) continue;
			if (edge1.leftLength >= edge2.rightLength) continue;
			const temp_dist = edge2.topLength - edge1.bottomLength;
			if (temp_dist < dist) dist = temp_dist;
			if (dist === 0) return 0;
		}
	}
	return dist;
}

export function _getBlockBottomMinDist(
	self: Rectangle,
	destBlock: Block
): number {
	let dist: number = 99999;
	for (const movingBlock of self.movingBlockList) {
		const _dist = _srcToDestBottomDist(movingBlock, destBlock);
		if (_dist < dist) dist = _dist;
		if (dist === 0) return 0;
	}
	return dist;
}

function _srcToDestRightDist(srcBlock: Block, destBlock: Block): number {
	let dist = 99999;
	for (const edge1 of srcBlock.rightEdges) {
		for (const edge2 of destBlock.leftEdges) {
			if (edge1.rightLength > edge2.leftLength) continue;
			if (edge1.bottomLength <= edge2.topLength) continue;
			if (edge1.topLength >= edge2.bottomLength) continue;
			const temp_dist = edge2.leftLength - edge1.rightLength;
			if (temp_dist < dist) dist = temp_dist;
			if (dist === 0) return 0;
		}
	}
	return dist;
}

export function _getBlockRightMinDist(
	self: Rectangle,
	destBlock: Block
): number {
	let dist: number = 99999;
	for (const movingBlock of self.movingBlockList) {
		const _dist = _srcToDestRightDist(movingBlock, destBlock);
		if (_dist < dist) dist = _dist;
		if (dist === 0) return 0;
	}
	return dist;
}

function _srcToDestLeftDist(srcBlock: Block, destBlock: Block): number {
	let dist = 99999;
	for (const edge1 of srcBlock.leftEdges) {
		for (const edge2 of destBlock.rightEdges) {
			if (edge1.leftLength < edge2.rightLength) continue;
			if (edge1.bottomLength <= edge2.topLength) continue;
			if (edge1.topLength >= edge2.bottomLength) continue;
			const temp_dist = edge1.leftLength - edge2.rightLength;
			if (temp_dist < dist) dist = temp_dist;
			if (dist === 0) return 0;
		}
	}
	return dist;
}

export function _getBlockLeftMinDist(
	self: Rectangle,
	destBlock: Block
): number {
	let dist: number = 99999;
	for (const movingBlock of self.movingBlockList) {
		const _dist = _srcToDestLeftDist(movingBlock, destBlock);
		if (_dist < dist) dist = _dist;
		if (dist === 0) return 0;
	}
	return dist;
}
