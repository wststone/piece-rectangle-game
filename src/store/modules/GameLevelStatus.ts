import { LevelData } from "@contexts/WindowDataTypes";
import { createSlice, PayloadAction as PA } from "@reduxjs/toolkit";
import { rootStateType } from "../index";

interface IGameLevelStatus {
	currentLevel: number;
	currentLevelName: string;
	currentExp: number;
	levelData: { [key: string]: LevelData } | null;
}

interface IChangeLevel {
	levelNum: number;
	levelName: string;
}

const initialState: IGameLevelStatus = {
	currentLevel: 0,
	currentLevelName: "简单",
	currentExp: 0,
	levelData: null,
};

const GameLevelStatusSlice = createSlice({
	name: "gamelevel",
	initialState,
	reducers: {
		INIT_LEVEL_DATA(state, data: PA<{ [key: string]: LevelData }>) {
			state.levelData = data.payload;
		},
		CHANGE_LEVEL(state, level: PA<IChangeLevel>) {
			state.currentLevel = level.payload.levelNum;
			state.currentLevelName = level.payload.levelName;
		},
		COMPLETE_LEVEL(state, level: PA<number>) {
			for (const key in state.levelData) {
				const { title } = state.levelData[key];
				if (
					title === state.currentLevelName &&
					state.levelData[key].top_level === level.payload - 1
				) {
					state.levelData[key].top_level = level.payload;
					break;
				}
			}
		},
	},
});

export const {
	INIT_LEVEL_DATA,
	CHANGE_LEVEL,
	COMPLETE_LEVEL,
} = GameLevelStatusSlice.actions;

export const currentLevelNumGetter = (state: rootStateType) =>
	state.GameLevelStatus.currentLevel;
export const currentLevelNameGetter = (state: rootStateType) =>
	state.GameLevelStatus.currentLevelName;
export const levelDataGetter = (state: rootStateType) =>
	state.GameLevelStatus.levelData;
export const currentTopLevelGetter = (state: rootStateType) => {
	return (
		Object.values(state.GameLevelStatus.levelData!).find(
			s => s.title === state.GameLevelStatus.currentLevelName
		).top_level + 1
	);
};

export default GameLevelStatusSlice.reducer;
