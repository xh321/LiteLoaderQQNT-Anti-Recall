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

        var unixElement = document.querySelector(
            `.message[id='ml-${msgId}'] .msg-content-container`
        );

        if (oldElement != null) appendRecalledTag(oldElement);
        else if (newElement != null)
            appendRecalledTag(newElement.parentElement);
        else if (unixElement != null)
            appendRecalledTag(unixElement.parentElement);
    });
    //消息列表更新回调
    anti_recall.recallTipList((event, msgIdList) => {
        recalledMsgList = msgIdList;
        render();
    });

    //监控消息列表，如果有撤回则渲染
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                if (
                    mutation.addedNodes != null &&
                    mutation.addedNodes.length > 0 &&
                    mutation.addedNodes[0].classList != null &&
                    mutation.addedNodes[0].classList.contains(
                        "message-content-recalled"
                    )
                ) {
                    //是添加的撤回标记，直接忽略
                } else {
                    render();
                }
            }
        }
    });

    console.log("[Anti-Recall]", "已在当前页面加载反撤回");

    const targetNode = document.body;
    const config = { attributes: true, childList: true, subtree: true };
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

                var unixElement = document.querySelector(
                    `.message[id='ml-${msgId}'] .msg-content-container`
                );

                if (oldElement != null) appendRecalledTag(oldElement);
                else if (newElement != null)
                    appendRecalledTag(newElement.parentElement);
                else if (unixElement != null)
                    appendRecalledTag(unixElement.parentElement);
            } catch (e) {
                console.log("[Anti-Recall]", "反撤回消息时出错", e);
            }
        });
    }

    function appendRecalledTag(msgElement) {
        if (!msgElement) return;

        var currRecalledTip = msgElement.querySelector(
            ".message-content-recalled"
        );
        if (currRecalledTip == null) {
            msgElement.style = `
position: relative;
margin-bottom: 15px;
overflow: unset !important;
            `;
            const recalledEl = document.createElement("div");
            recalledEl.innerText = "已撤回";
            recalledEl.classList.add("message-content-recalled");
            recalledEl.style = `
position: absolute;
top: calc(100% + 4px);
font-size: 12px;
white-space: nowrap;
color: var(--text-color);
left: 0;
background-color: var(--background-color-05);
backdrop-filter: blur(28px);
padding: 2px 8px;
border-radius: 6px;
box-shadow: var(--box-shadow);
transition: 300ms;
transform: translateX(-30%);
opacity: 0;
pointer-events: none;
color:red;
            `;

            msgElement.appendChild(recalledEl);
            setTimeout(() => {
                recalledEl.style.transform = "translateX(0)";
                recalledEl.style.opacity = "1";
            }, 5);
        } else {
            //已经有撤回标记了，不再重复添加
        }
    }
}
