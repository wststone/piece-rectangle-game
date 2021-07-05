export default function getUsageName(name: string) {
    if (name === "简单") return "easy";
    else if (name === "中等") return "medium";
    else if (name === "困难") return "hard";
    return name;
}