import LevelSelectContext from "@contexts/LevelSelectContext";
import styles from "./style.module.scss";
import { FC, useContext, useState } from "react";
import GameContext from "@contexts/GameContext";
import Canvas from "@components/Canvas";
import TopNavigation from "@components/Layout/TopNavigation";
import LevelSelection from "../LevelSelection";
import GameCompleted from "@components/GameCompleted";
import { ToastContainer } from "react-toastify";

const GameInProgress: FC = () => {
	const { gameWon } = useContext(GameContext);
	const [showLevelSelect, setShowLevelSelect] = useState<boolean>(false);

	return (
		<LevelSelectContext.Provider
			value={{ showLevelSelect, setShowLevelSelect }}
		>
			<div className={styles.in_progress}>
				<TopNavigation />
				<ToastContainer closeButton={false} />
				<Canvas />
				<LevelSelection />
				{gameWon ? <GameCompleted /> : <></>}
			</div>
		</LevelSelectContext.Provider>
	);
};

export default GameInProgress;
