import { createContext } from "react";

interface ILevelSelect {
	showLevelSelect: boolean;
	setShowLevelSelect: (setShow: boolean) => void;
}

const defaultLevelSelectContext: ILevelSelect = {
	showLevelSelect: false,
	setShowLevelSelect: () => {},
};

const LevelSelectContext = createContext<ILevelSelect>(
	defaultLevelSelectContext
);

export default LevelSelectContext;
