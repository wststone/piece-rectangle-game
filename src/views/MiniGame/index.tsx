import DifficultySelection from "./DifficultySelection";
import loadingPic from "@assets/加载.png";
import { Route, Switch, useHistory } from "react-router-dom";
import GameContext, {
	Game,
	gameInitData,
	auth_cookie,
} from "@contexts/GameContext";
import { useDispatch } from "react-redux";
import { INIT_LEVEL_DATA, CHANGE_LEVEL } from "@store/modules/GameLevelStatus";
import {
	lazy,
	Suspense,
	FC,
	useEffect,
	useState,
	useMemo,
	useCallback,
} from "react";
import Loading from "@views/Loading";
import { DifficultyName } from "@root/components/Canvas/classes/utils/constants";

const GameInProgress = lazy(() => {
	return Promise.all([import("./GameInProgress"), Game.loadResources()]).then(
		([moduleExports]) => moduleExports
	);
});

const PieceRectangle: FC = ({ children }) => {
	const dispatch = useDispatch();
	const [gameWon, setGameWon] = useState<boolean>(false);
	const [completeTimer, setCompleteTimer] = useState<number>(
		new Date().getTime()
	);
	const loadLevel = useCallback(
		(levelName: DifficultyName | string, levelNum: number) => {
			Game.loadLevel(levelName, levelNum);
			setCompleteTimer(new Date().getTime());
			dispatch(
				CHANGE_LEVEL({
					levelNum,
					levelName,
				})
			);
		},
		[dispatch]
	);
	const value = useMemo(
		() => ({
			completeTimer,
			setCompleteTimer,
			gameWon,
			setGameWon,
			loadLevel,
			Game,
			gameInitData,
			auth_cookie,
		}),
		[gameWon, loadLevel, completeTimer]
	);
	return (
		<GameContext.Provider value={value}>{children}</GameContext.Provider>
	);
};

const MainGame: FC = () => {
	let history = useHistory();
	const dispatch = useDispatch();
	useEffect(() => {
		history.push("/difficulty");
		const { gameInfo } = gameInitData;
		dispatch(INIT_LEVEL_DATA(gameInfo.levelData));
		return () => {};
	}, [history, dispatch]);

	return (
		<PieceRectangle>
			<Switch>
				<Route path={"/difficulty"}>
					<DifficultySelection />
				</Route>
				<Route path={"/game"}>
					<Suspense
						fallback={<Loading backgroundImage={loadingPic} />}
					>
						<GameInProgress />
					</Suspense>
				</Route>
			</Switch>
		</PieceRectangle>
	);
};

export default MainGame;
