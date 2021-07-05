import { useSelector } from "react-redux";
import {
	currentLevelNumGetter,
	currentLevelNameGetter,
} from "@store/modules/GameLevelStatus";
import styles from "./style.module.scss";
import {
	FC,
	useRef,
	useEffect,
	useContext,
	useCallback,
	HTMLAttributes,
} from "react";
import GameContext from "@root/contexts/GameContext";
import {
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	DifficultyName,
} from "./classes/utils/constants";

const Canvas: FC<HTMLAttributes<HTMLCanvasElement>> = props => {
	const { setGameWon, Game } = useContext(GameContext);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const levelName = useSelector(currentLevelNameGetter) as DifficultyName;
	const levelNum = useSelector(currentLevelNumGetter);
	const checkWin = useCallback(() => {
		if (Game.isWon) setGameWon(true);
	}, [Game.isWon, setGameWon]);
	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			Game.initGame({
				levelName,
				levelNum,
				canvas: canvas,
			});
		}
		return () => Game.endGame();
	}, [Game, levelName, levelNum]);

	return (
		<canvas
			width={CANVAS_WIDTH} //original: 324
			height={CANVAS_HEIGHT} //original: 432
			className={styles.canvas}
			onTouchEnd={checkWin}
			ref={canvasRef}
			{...props}
		></canvas>
	);
};

export default Canvas;
