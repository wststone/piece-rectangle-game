import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import { FC, useMemo, useContext, useCallback } from "react";
import { levelDataGetter } from "@store/modules/GameLevelStatus";
import backIcon from "@assets/返回.svg";
import DifficultyButton from "@components/DifficultyButton";
import ExpButton from "@components/ExperienceExplanation";
import GameContext from "@contexts/GameContext";

const DifficultySelection: FC = () => {
	const { gameInitData } = useContext(GameContext);
	const levelData = useSelector(levelDataGetter);
	const levelDatas = useMemo(
		() => (levelData ? Object.values(levelData) : []),
		[levelData]
	);
	const navigateToEntry = useCallback(() => {
		window.location.href = gameInitData.gameInfo.rank_url;
	}, [gameInitData.gameInfo.rank_url]);

	return (
		<>
			<div className={styles.difficulty_nav}>
				<img
					src={backIcon}
					alt="返回按钮"
					className={styles.back_icon}
					onClick={navigateToEntry}
				/>
				选择难度
			</div>
			<div className={styles.difficulty_background}>
				<div className={styles.difficulty_options}>
					{levelDatas.map((l, index) => (
						<DifficultyButton
							key={index}
							difficultyName={l.title}
							totalLevel={l.lv_num}
							completedLevel={l.top_level}
							style={{ margin: "10% 0" }}
						/>
					))}
				</div>
				<div className={styles.exp_row}>
					<ExpButton />
				</div>
			</div>
		</>
	);
};

export default DifficultySelection;
