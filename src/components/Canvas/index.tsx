import styles from "./style.module.scss";
import {
	FC,
	useRef,
	useEffect,
	useCallback,
	HTMLAttributes,
} from "react";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./classes/utils/constants";
import GameGenerator from "./classes/GameGenerator";

const Canvas: FC<HTMLAttributes<HTMLCanvasElement>> = props => {
	const GameRef = useRef<GameGenerator>(new GameGenerator());
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const checkWin = useCallback(() => {
		if (GameRef.current.isWon) {
			// dosomething
		}
	}, []);
	useEffect(() => {
		(async function () {
			const Game = GameRef.current;
			await Game.loadResources();
			// Game.loadLevel(0);
			if (canvasRef.current) {
				const canvas = canvasRef.current;
				Game.initGame({
					levelNum: 0,
					canvas: canvas,
				});
			}
		})();
	}, []);

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
