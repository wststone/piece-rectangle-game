import { ILevelInfo } from "@components/LevelCircle";

export function createLevelArray(completedNum: number, totalNum: number): ILevelInfo[] {
	const levelStats = Array.from({ length: totalNum }, (_, i) => ({
		levelNum: i + 1,
		isCompleted: false,
	}));
	for (let i = 0; i < completedNum; i++) {
		levelStats[i].isCompleted = true;
	}
	return levelStats;
}
