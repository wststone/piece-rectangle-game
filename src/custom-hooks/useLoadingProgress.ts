import { useState, useEffect } from "react";

const useLoadingProgress = (
	changeInterval: number,
	loadingPromise?: Promise<any>
) => {
	const [finished, setFinished] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	useEffect(() => {
		const _timer = setInterval(() => {
			setProgress(
				prevProgress => prevProgress + Math.floor(Math.random() * 10)
			); // Increment by [1-9]
		}, changeInterval);
		if (progress + 9 > 100 || loadingPromise) {
			clearInterval(_timer);
			setProgress(100);
			setFinished(true);
		}
		return () => clearInterval(_timer);
	}, [changeInterval, progress, loadingPromise]);

	return {
		finished: finished,
		progress: progress,
	};
};

export default useLoadingProgress;
