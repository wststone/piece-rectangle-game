import styles from "./style.module.scss";
import Card from "@components/Universial/Card";
import Modal from "@components/Universial/Modal";
import { FC, useState } from "react";
import expIcon from "@assets/说明.svg";

const ExperienceExplanation: FC = () => {
	const [showExpModal, setShowExpModal] = useState<boolean>(false);

	return (
		<div
			className={styles.exp_container}
			onClick={() => setShowExpModal(s => !s)}
		>
			<img src={expIcon} width="18" height="18" alt="经验值说明图标" />
			<Modal show={showExpModal} center>
				<Card rounded scroll height={366}>
					<div className={styles.explanation_container}>
						<div className={styles.exp_title}>经验值说明</div>
						<p>
							1、拼成长方形难度分为简单、中等、困难，每过一关分别可得1、2、3个经验值，依次类推。
						</p>
						<p>
							2、如果连续闯关成功，小乐会连续递增奖励经验值，比如中等，第1关得2个经验值，第2关得4个经验值，第N关得2N个经验值。
						</p>
						<p>
							3、已闯过的关，再次闯关不得经验值，而且也不记录到连续闯关中。
						</p>
					</div>
				</Card>
			</Modal>
			经验值说明
		</div>
	);
};

export default ExperienceExplanation;
