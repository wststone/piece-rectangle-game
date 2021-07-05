import styles from "./style.module.scss";
import useLoadingProgress from "@hooks/useLoadingProgress";
import ProgressBar from "@components/Universial/ProgressBar";
import { FC } from "react";

interface LoadingProps {
	backgroundImage?: string;
}

const Loading: FC<LoadingProps> = ({ backgroundImage }) => {
	const { progress } = useLoadingProgress(100);

	return (
		<div
			className={styles.loading}
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<div className={styles.__progress}>
				<ProgressBar width="300px" height="15px" value={progress} />
				<span className={styles.__loading_text}>
					加载中... ({progress}%)
				</span>
			</div>
		</div>
	);
};

export default Loading;
