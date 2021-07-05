import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import {
	currentTopLevelGetter,
	currentLevelNameGetter,
} from "@store/modules/GameLevelStatus";
import { FC, memo, useCallback, useContext } from "react";
import LevelSelectContext from "@contexts/LevelSelectContext";
import GameContext from "@contexts/GameContext";
import { toast } from "react-toastify";

export interface ILevelInfo {
	levelNum: number;
	isCompleted: boolean;
}

const LevelCircle: FC<ILevelInfo> = memo(({ levelNum, isCompleted }) => {
	const { loadLevel } = useContext(GameContext);
	const { setShowLevelSelect } = useContext(LevelSelectContext);
	const levelName = useSelector(currentLevelNameGetter);
	const topLevel = useSelector(currentTopLevelGetter);
	const selectLevel = useCallback(() => {
		if (isCompleted) {
			setShowLevelSelect(false);
			loadLevel(levelName, levelNum);
		} else {
			toast.error(`请完成第${topLevel}关之前的关卡！`, {
				position: "top-center",
				autoClose: 3000,
				hideProgressBar: true,
				pauseOnHover: false,
				draggable: false,
			});
		}
	}, [
		isCompleted,
		levelNum,
		levelName,
		loadLevel,
		setShowLevelSelect,
		topLevel,
	]);

	return (
		<div
			className={
				isCompleted
					? styles.level_circle__completed
					: styles.level_circle__uncompleted
			}
			onClick={selectLevel}
		>
			{levelNum}
		</div>
	);
});

export default LevelCircle;
