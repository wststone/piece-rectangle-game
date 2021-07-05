export default function getGameHard(levelName: string): number{
    switch (levelName) {
        case "简单":
            return 1;
        case "中等":
            return 2;
        case "困难":
            return 3;
        default:
            return 1;
    }
}