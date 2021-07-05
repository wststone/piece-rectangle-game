import styles from "./style.module.scss";
import classNames from "classnames";
import { FC, HTMLAttributes, memo } from "react";

interface ICardProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "width" | "height"> {
	width?: number;
	height?: number;
	rounded?: boolean;
	color?: string;
	scroll?: boolean;
}

const Card: FC<ICardProps> = memo(
	({ width, height, rounded, color, scroll, children, ...props }) => {
		const inlineStyle = {
			width: width,
			backgroundColor: color,
			height: height,
		};

		return (
			<div
				className={classNames(
					styles.card,
					rounded && styles.card__rounded,
					scroll && styles.card__scroll
				)}
				style={inlineStyle}
				{...props}
			>
				<div className={styles.card_content}>{children}</div>
			</div>
		);
	}
);

export default Card;
