export function onLoad() {
    //消息更新回调
    anti_recall.recallTip((event, msgId) => {
        console.log("[Anti-Recall]", "尝试反撤回消息ID", msgId);

        var oldElement = document.querySelector(
            `div[id='${msgId}-msgContainerMsgContent'] > .msg-content-container`
        );

        var newElement = document.querySelector(
            `.msg-content-container[id='${msgId}-msgContent']`
        );

        if (oldElement != null)
            oldElement.style =
                "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
        else if (newElement != null)
            newElement.style =
                "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
    });
    //消息列表更新回调
    anti_recall.recallTipList((event, msgIdList) => {
        console.log("[Anti-Recall]", "尝试反撤回消息列表", msgIdList);
        var timer = setInterval(() => {
            msgIdList.forEach((msgId) => {
                try {
                    var oldElement = document.querySelector(
                        `div[id='${msgId}-msgContainerMsgContent'] > .msg-content-container`
                    );

                    var newElement = document.querySelector(
                        `.msg-content-container[id='${msgId}-msgContent']`
                    );

                    if (oldElement != null)
                        oldElement.style =
                            "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";
                    else if (newElement != null)
                        newElement.style =
                            "border: 1px solid red;box-shadow: 0px 0px 15px 0px red;border-radius: 10px;text-decoration-line: line-through";

                    if (timer != null) {
                        clearInterval(timer);
                        timer = null;
                    }
                } catch {}
            });
        }, 50);
    });
}
