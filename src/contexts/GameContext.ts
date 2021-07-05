import { createContext } from "react";
import { GameInfo, TEST_WINDOW_DATA } from "./WindowDataTypes";
import GameGenerator from "@components/Canvas/classes/GameGenerator";

interface IGameContext {
	gameWon: boolean;
	completeTimer: number;
	setCompleteTimer: (time: number) => void;
	setGameWon: (isWon: boolean) => void;
	loadLevel: (levelName: string, levelNum: number) => void;
	Game: GameGenerator;
	gameInitData?: GameInfo;
	auth_cookie: string;
}

export const Game = new GameGenerator();
export const gameInitData =
	((window as any).gameInitData as GameInfo) || TEST_WINDOW_DATA;
export const auth_cookie =
	gameInitData?.AttachParameter?.request?.auth_cookie ||
	new URL(window.location.href).searchParams.get("auth_cookie")!;

const defaultGameContext: IGameContext = {
	gameWon: false,
	completeTimer: 0,
	setCompleteTimer: () => {},
	loadLevel: () => {},
	setGameWon: () => {},
	Game,
	gameInitData,
	auth_cookie,
};
const GameContext = createContext(defaultGameContext);

export default GameContext;
