var recalledMsgList = [];
export function onLoad() {
    //消息更新回调
    anti_recall.recallTip((event, msgId) => {
        console.log("[Anti-Recall]", "尝试反撤回消息ID", msgId);

        var oldElement = document.querySelector(
            `div[id='${msgId}-msgContainerMsgContent']`
        );

        var newElement = document.querySelector(
            `.msg-content-container[id='${msgId}-msgContent']`
        );

        if (oldElement != null)
            oldElement.style =
                "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
        else if (newElement != null)
            newElement.parentElement.style =
                "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
    });
    //消息列表更新回调
    anti_recall.recallTipList((event, msgIdList) => {
        recalledMsgList = msgIdList;
    });

    //监控消息列表，如果有撤回则渲染
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                render();
            }
        }
    });

    console.log("[Anti-Recall]", "已在当前页面加载反撤回");

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    function render() {
        //console.log("[Anti-Recall]", "尝试反撤回消息列表", recalledMsgList);

        recalledMsgList.forEach((msgId) => {
            try {
                var oldElement = document.querySelector(
                    `div[id='${msgId}-msgContainerMsgContent']`
                );

                var newElement = document.querySelector(
                    `.msg-content-container[id='${msgId}-msgContent']`
                );

                if (oldElement != null)
                    oldElement.style =
                        "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
                else if (newElement != null)
                    newElement.parentElement.style =
                        "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
            } catch (e) {
                console.log("[Anti-RECALL]", "反撤回消息时出错", e);
            }
        });
    }
}
