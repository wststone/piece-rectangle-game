import {
	COMPLETE_LEVEL,
	currentLevelNameGetter,
	currentLevelNumGetter,
} from "@store/modules/GameLevelStatus";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import styles from "./style.module.scss";
import {
	FC,
	useState,
	useEffect,
	useContext,
	useMemo,
	useCallback,
} from "react";
import GameContext from "@root/contexts/GameContext";
import Modal from "../Universial/Modal";
import Button from "../Universial/Button";
import { useHistory } from "react-router-dom";
import axios from "axios";
import getGameHard from "./getGameHard";
import { PanguAPIResponse } from "@contexts/WindowDataTypes";

interface ISubmitParameter {
	gt_id?: number;
	game_hard?: number;
	game_level?: number;
	use_time: number;
	score?: number;
	auth_cookie: string;
}

interface IExpData {
	add_exp: number;
	total_exp: number;
	total_time: number;
}

const GameCompleted: FC = () => {
	console.log("GAMECOMPLETED RENDERED");
	let history = useHistory();
	const dispatch = useDispatch();
	const [allComplete, setAllComplete] = useState<boolean>(false);
	const [exp, setExp] = useState<number>(0);
	const [error, setError] = useState<string>("");
	const {
		completeTimer,
		loadLevel,
		gameWon,
		setGameWon,
		auth_cookie,
		gameInitData,
	} = useContext(GameContext);
	const currentLevelName = useSelector(currentLevelNameGetter);
	const currentLevelNum = useSelector(currentLevelNumGetter);
	const gameHard = useMemo(() => getGameHard(currentLevelName), [
		currentLevelName,
	]);

	useEffect(() => {
		async function submitData({
			gt_id,
			game_hard,
			game_level,
			use_time,
			auth_cookie,
		}: ISubmitParameter) {
			const response = await axios
				.post<PanguAPIResponse<IExpData>>("pangu.php", {
					api_url: "/api/common/computer/game_save_record",
					gt_id,
					game_hard,
					game_level,
					use_time,
					auth_cookie,
				})
				.catch(() => setError("网络请求错误！"));
			if (response) {
				const { data } = response;
				if (data.code === 200) {
					const { add_exp } = data.data;
					setExp(add_exp);
					const expDom = document.getElementById("exp")!;
					expDom.textContent = add_exp.toString();
					// safari 解决方案
				} else {
					setError("网络请求错误！");
				}
			}
		}
		const completeTime = (new Date().getTime() - completeTimer) / 1000;
		if (completeTime > 1) {
			submitData({
				gt_id: gameInitData!.gameInfo.gt_id,
				game_hard: gameHard,
				game_level: currentLevelNum,
				use_time: completeTime,
				auth_cookie,
			});
		}
		return () => {};
	}, [
		setExp,
		auth_cookie,
		completeTimer,
		currentLevelNum,
		gameHard,
		gameInitData,
	]);
	useEffect(() => {
		if (currentLevelNum === 50) setAllComplete(true);
		return () => {
			setGameWon(false);
		};
	}, [currentLevelNum, setGameWon]);
	const goBack = useCallback(() => {
		history.goBack();
		dispatch(COMPLETE_LEVEL(currentLevelNum));
	}, [dispatch, currentLevelNum, history]);
	const nextLevel = useCallback(() => {
		loadLevel(currentLevelName, currentLevelNum + 1);
		dispatch(COMPLETE_LEVEL(currentLevelNum));
	}, [dispatch, currentLevelName, currentLevelNum, loadLevel]);

	return (
		<Modal show={gameWon} center>
			<div
				className={classnames(
					styles.game_completed,
					allComplete && styles.game_completed__all
				)}
			>
				<div className={styles.completed_infos}>
					<div className={styles.exp_container}>
						<span className={styles.exp_text}>
							{error ? error : "经验值+"}
						</span>
						{error ? null : (
							<span id="exp" className={styles.exp_num}>
								{exp}
							</span>
						)}
					</div>
					{!allComplete ? (
						<Button
							width="180px"
							height="60px"
							usage="next"
							rounded
							onClick={nextLevel}
						>
							下一关
						</Button>
					) : null}
					<Button
						width="180px"
						height="60px"
						usage="back"
						rounded
						onClick={goBack}
					>
						返回
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default GameCompleted;
