import styles from "./style.module.scss";
import classNames from "classnames";
import {
	forwardRef,
	useState,
	useRef,
	useEffect,
	FC,
	memo,
	HTMLAttributes,
} from "react";
import ReactDOM from "react-dom";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
	show?: boolean;
	center?: boolean;
}

const Modal: FC<ModalProps> = memo(({ show, center, children, ...props }) => {
	const [selfShow, setSelfShow] = useState<boolean>(false);
	useEffect(() => {
		setSelfShow(show!);
	}, [show]);
	const modalRef = useRef<HTMLDivElement>(document.createElement("div"));
	const modalContentRef = useRef<HTMLDivElement>(
		document.createElement("div")
	);
	useEffect(() => {
		const $modal = modalRef.current;
		document.getElementById("root")!.append($modal);
		return () => {
			$modal.remove();
		};
	}, []);

	return ReactDOM.createPortal(
		<div
			className={
				show && selfShow ? styles.modal_show : styles.modal_hidden
			}
			{...props}
		>
			<div
				ref={modalContentRef}
				className={classNames(
					styles.modal_content,
					center && styles.__center
				)}
			>
				{children}
			</div>
		</div>,
		modalRef.current
	);
});

export default Modal;
