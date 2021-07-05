import styles from "./style.module.scss";
import { FC, memo } from "react";

interface IProgressBar {
	linear?: boolean;
	text?: boolean;
	color?: string;
	backgroundColor?: string;
	value?: number;
	width?: string;
	height?: string;
}

const ProgressBar: FC<IProgressBar> = memo(
	({ color, backgroundColor, text, width, height, value }) => {
		const inlineStyle = {
			width: width,
			height: height,
			backgroundColor: backgroundColor,
		};
		return (
			<div className={styles.progress_bar} style={inlineStyle}>
				{text ? <div>{value}</div> : <></>}
				<div
					className={styles.__progress_done}
					style={{ width: value + "%", backgroundColor: color }}
				></div>
			</div>
		);
	}
);

export default ProgressBar;
