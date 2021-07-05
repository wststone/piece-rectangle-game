import classnames from "classnames";
import styles from "./style.module.scss";
import { FC, ButtonHTMLAttributes, memo, useMemo } from "react";
import getUsageName from "./getUsageName";

interface IButtonProps
	extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "width" | "height"> {
	width?: number | string;
	height?: number | string;
	rounded?: boolean;
	elevated?: boolean;
	backgroundColor?: string;
	pill?: boolean;
	color?: string;
	outlined?: boolean;
	usage?: string;
	text?: boolean;
}

const Button: FC<IButtonProps> = memo(
	({
		width,
		height,
		rounded,
		usage,
		backgroundColor,
		elevated,
		color,
		pill,
		children,
		...props
	}) => {
		const inlineStyle = {
			width: width,
			height: height,
			color: color,
			backgroundColor: backgroundColor,
		};
		usage = useMemo(() => getUsageName(usage!), [usage]);

		return (
			<button
				className={classnames(
					styles.button,
					rounded && styles.__rounded,
					elevated && styles.__elevated,
					pill && styles.__pill,
					styles[usage]
				)}
				style={inlineStyle}
				{...props}
			>
				<span className={styles.btn_content}>{children}</span>
			</button>
		);
	}
);

export default Button;
