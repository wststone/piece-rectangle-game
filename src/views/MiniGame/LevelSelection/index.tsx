import styles from "./style.module.scss";
import LevelSelectContext from "@contexts/LevelSelectContext";
import {
	FC,
	useMemo,
	useContext,
	useCallback,
	useRef,
	MouseEvent,
} from "react";
import LevelCircle from "@root/components/LevelCircle";
import Modal from "@components/Universial/Modal";
import Card from "@components/Universial/Card";
import { useSelector } from "react-redux";
import {
	levelDataGetter,
	currentLevelNameGetter,
} from "@store/modules/GameLevelStatus";
import { createLevelArray } from "./array-helper";

const LevelSelection: FC = () => {
	const { showLevelSelect, setShowLevelSelect } = useContext(
		LevelSelectContext
	);
	const levelName = useSelector(currentLevelNameGetter);
	const levelData = useSelector(levelDataGetter);
	const { title, lv_num, top_level } = useMemo(
		() => Object.values(levelData).find(l => l.title === levelName),
		[levelData, levelName]
	);
	const levelStats = useMemo(() => createLevelArray(top_level + 1, lv_num), [
		lv_num,
		top_level,
	]);
	const wrapperRef = useRef(document.createElement("div"));
	const clickOutside = useCallback(
		(e: MouseEvent) => {
			if (
				e.target !== wrapperRef.current &&
				!wrapperRef.current.contains(e.target as Node)
			) {
				setShowLevelSelect(false);
			}
		},
		[setShowLevelSelect]
	);

	return (
		<Modal show={showLevelSelect} center onClick={clickOutside}>
			<Card rounded scroll height={500}>
				<div ref={wrapperRef}>
					<div className={styles.__top_text}>{title}</div>
					<div className={styles.__level_grid}>
						{levelStats.map((l, index) => (
							<LevelCircle
								key={index}
								levelNum={l.levelNum}
								isCompleted={l.isCompleted}
							/>
						))}
					</div>
				</div>
			</Card>
		</Modal>
	);
};

export default LevelSelection;
