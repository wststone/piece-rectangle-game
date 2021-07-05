import styles from "./style.module.scss";
import muteIcon from "@assets/关闭声音.svg";
import unMuteIcon from "@assets/开启声音.svg";
import menuIcon from "@assets/回主页.svg";
import levelIcon from "@assets/菜单.svg";
import GameContext from "@contexts/GameContext";
import LevelSelectContext from "@contexts/LevelSelectContext";
import { useHistory } from "react-router-dom";
import { FC, useState, useCallback, memo, useContext } from "react";
import {
	currentLevelNumGetter,
	currentLevelNameGetter,
} from "@store/modules/GameLevelStatus";
import { useSelector } from "react-redux";

const TopNavigation: FC = memo(() => {
	let history = useHistory();
	const { setGameWon, gameInitData, Game } = useContext(GameContext);
	const [audioPlaying, setAudioPlaying] = useState<boolean>(true);
	const cheatCode = useCallback(() => {
		setGameWon(true);
	}, [setGameWon]);
	const mute = useCallback(() => {
		Game.muteAudio();
		setAudioPlaying(false);
	}, [Game]);
	const unMute = useCallback(() => {
		Game.playAudio();
		setAudioPlaying(true);
	}, [Game]);

	const { showLevelSelect, setShowLevelSelect } = useContext(
		LevelSelectContext
	);
	const levelNum = useSelector(currentLevelNumGetter);
	const levelName = useSelector(currentLevelNameGetter);
	const goHome = useCallback(() => {
		history.goBack();
	}, [history]);
	const toggleLevelSelection = useCallback(() => {
		setShowLevelSelect(!showLevelSelect);
	}, [showLevelSelect, setShowLevelSelect]);

	return (
		<div className={styles.navigation}>
			<div className={styles.__nav_cotainer}>
				<img
					src={menuIcon}
					width="32"
					height="32"
					alt=""
					onClick={goHome}
				/>
				<div className={styles.__level_text}>
					{levelName}- 第{levelNum}关
				</div>
				{/* {gameInitData!.AttachParameter.web_env === "test" ? (
					<span
						className={styles.solution}
						onClick={cheatCode}
						style={{ color: "beige" }}
					>
						直接过关
					</span>
				) : null} */}
				<div className={styles.right_icon_container}>
					<img
						src={audioPlaying ? muteIcon : unMuteIcon}
						width="32"
						height="32"
						alt="静音按钮"
						onClick={audioPlaying ? mute : unMute}
					></img>
					<img
						src={levelIcon}
						width="32"
						height="32"
						alt="选择关卡按钮"
						onClick={toggleLevelSelection}
					/>
				</div>
			</div>
		</div>
	);
});

export default TopNavigation;
