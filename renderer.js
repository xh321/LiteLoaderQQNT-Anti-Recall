export function onLoad() {
    anti_recall.recallTip((event, msgId) => {
        console.log("[Anti-Recall]", "尝试反撤回消息ID", msgId);

        try {
            document.querySelector(
                `div[id='${msgId}-content'] > span > span`
            ).innerText += "\n[该消息已被撤回]";
        } catch {}
        
        try {
            //兼容旧版本
            document.querySelector(
                `div[id='${msgId}-msgContent'] > span > span`
            ).innerText += "\n[该消息已被撤回]";
        } catch {}
    });
}
