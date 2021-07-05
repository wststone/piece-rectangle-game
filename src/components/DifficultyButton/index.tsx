import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import { CHANGE_LEVEL } from "@store/modules/GameLevelStatus";
import { FC, useCallback, HTMLAttributes } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "lexue-minigame-shared-components";

export interface IDifficulty extends HTMLAttributes<HTMLDivElement> {
	difficultyName: string;
	totalLevel: number;
	completedLevel: number;
}

const DifficultyButton: FC<IDifficulty> = ({
	difficultyName,
	totalLevel,
	completedLevel,
	...props
}) => {
	let history = useHistory();
	const dispatch = useDispatch();
	const handleClick = useCallback(() => {
		history.push("/game");
		dispatch(
			CHANGE_LEVEL({
				levelNum: completedLevel + 1,
				levelName: difficultyName,
			})
		);
	}, [history, completedLevel, difficultyName, dispatch]);

	return (
		<>
			<div className={styles.difficulty_option} {...props}>
				<Button
					width="180px"
					height="60px"
					rounded
					usage={difficultyName}
					onClick={handleClick}
				>
					{difficultyName}
				</Button>
				{
					<span
						className={
							completedLevel === totalLevel
								? styles.__completed_text
								: styles.__uncompleted_text
						}
					>
						{completedLevel === totalLevel
							? "已通关"
							: `${completedLevel}/${totalLevel}`}
					</span>
				}
			</div>
		</>
	);
};

export default DifficultyButton;
