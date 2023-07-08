const { BrowserWindow, ipcMain } = require("electron");

var mainWindowObj = null;
function onLoad(plugin) {
}

function onBrowserWindowCreated(window) {
    
    window.webContents.on("did-stop-loading", () => {
        if (window.webContents.getURL().indexOf("#/main/message") != -1) {
            mainWindowObj = window;
        }
    });

    const original_send = window.webContents.send;
    //var myUid = "";
    window.webContents.send = function (channel, ...args) {
        if (args.length >= 2) {
            if (
                args.some(
                    (item) =>
                        item instanceof Array &&
                        item.length > 0 &&
                        item[0] &&
                        item[0].cmdName != null
                )
            ) {
                var args1 = args[1][0];

                //方法一：获取个人信息的IPC，用来获取个人UID，避免防撤回自己的消息
                // if (args1.cmdName.indexOf("onProfileDetailInfoChanged") != -1) {
                //     myUid = args1.payload.info.uid;
                // } else
                //目前采用方法二，直接获取撤回消息中的参数
                //拦截撤回IPC
                if (args1.cmdName.indexOf("onMsgInfoListUpdate") != -1) {
                    var msgList = args1.payload.msgList[0];
                    if (
                        msgList.elements[0].grayTipElement != null 
                        &&
                        msgList.elements[0].grayTipElement.revokeElement == null
                    ) {
                        console.log(args[1][0].payload.msgList[0]);
                        console.log(
                            "<========================================>"
                        );
                        console.log(msgList.elements[0]);
                    }
                    if (msgList.msgType == 5 && msgList.subMsgType == 4) {
                        //不是自己撤回的，才拦截
                        if (
                            !msgList.elements[0].grayTipElement.revokeElement
                                .isSelfOperate
                        ) {
                            mainWindowObj.webContents.send(
                                "LiteLoader.anti_recall.mainWindow.recallTip",
                                msgList.msgId
                            );

                            // console.log(args1.payload);
                            //args[1][0].payload = null;
                            args[1][0].payload = null;
                            output("Detected recall, intercepted");
                        }
                    }
                }
            }
        }
        return original_send.call(window.webContents, channel, ...args);
    };

    output("NTQQ Anti-Recall loaded");
}

function output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "Anti-Recall:", ...args);
}

module.exports = {
    onLoad,
    onBrowserWindowCreated
};
