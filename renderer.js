var recalledMsgList = [];

var nowConfig = {};

export async function onConfigView(view) {
    nowConfig = await window.anti_recall.getNowConfig();

    const new_navbar_item = `
    <body>
      <div class="config_view">
        <section class="path">
          <h1>主配置</h1>
          <div class="wrap">

            <div class="list">      
            <div class="vertical-list-item top-box">
              <h2>操作</h2>
              <div>
                <button id="clearDb" class="q-button q-button--small q-button--secondary">清空已储存的撤回消息</button>
              </div>
            </div>
            <hr class="horizontal-dividing-line" />
              <div class="vertical-list-item">
                <div style="width:90%;" >
                  <h2>是否将撤回消息存入数据库</h2>
                  <span class="secondary-text">数据库不加密，若开启风险自负；若不开启，重启QQ后撤回消息会丢失；开启选项后，反撤回消息才会开始保存；若之前开过，现在关闭，储存的消息不会被删除，需要你手动清理。</span>
                </div>
                <div id="switchSaveDb" class="q-switch">
                  <span class="q-switch__handle"></span>
                </div>
              </div>

            <hr class="horizontal-dividing-line" />
              <div class="vertical-list-item">
                <div style="width:90%;" >
                  <h2>是否反撤回自己的消息</h2>
                  <span class="secondary-text">如果开启，则自己发送的消息也会被反撤回。开启后，从下一条消息开始起生效。</span>
                </div>
                <div id="switchAntiRecallSelf" class="q-switch">
                  <span class="q-switch__handle"></span>
                </div>
              </div>


            </div>

          </div>
        </section>

        <section class="path">
          <h1>样式配置</h1>
          <div class="wrap">

            <div class="list">

              <div class="vertical-list-item">
                <div>
                  <h2>撤回主题色</h2></h2>
                  <span class="secondary-text">将会同时影响阴影和“已撤回”提示的颜色</span>
                </div>
                <div>
                  <input type="color" value="#ff0000" class="q-button q-button--small q-button--secondary pick-color" />
                </div>
              </div>

              <hr class="horizontal-dividing-line" />          

              <div class="vertical-list-item">
                <div>
                  <h2>撤回后消息是否显示阴影</h2>
                  <span class="secondary-text">修改将自动保存并实时生效</span>
                </div>
                <div id="switchShadow" class="q-switch">
                  <span class="q-switch__handle"></span>
                </div>
              </div>

              <hr class="horizontal-dividing-line" />          

              <div class="vertical-list-item">
                <div>
                  <h2>撤回后消息下方是否显示“已撤回”提示</h2>
                  <span class="secondary-text">修改将自动保存并在重新滚动消息后生效</span>
                </div>
                <div id="switchTip" class="q-switch">
                  <span class="q-switch__handle"></span>
                </div>
              </div>

            </div>

          </div>
        </section>

        <style>
          .img-hidden {
            display:none;
          }

          .path-input {
            align-self: normal;
            flex: 1;
            border-radius: 4px;
            margin-right: 16px;
            transition: all 100ms ease-out;
          }
        
          .path-input:focus {
            padding-left: 4px;
          }
          
          .bq-icon {
            height:16px;
            width:16px;
          }
          
          /* 通用 */
          .config_view {
              margin: 20px;
          }
          
          .config_view h1 {
              color: var(--text_primary);
              font-weight: var(--font-bold);
              font-size: min(var(--font_size_3), 18px);
              line-height: min(var(--line_height_3), 24px);
              padding: 0px 16px;
              margin-bottom: 8px;
          }
          
          .config_view .wrap {
              /* Linux样式兼容：--fg_white */
              background-color: var(--fill_light_primary, var(--fg_white));
              border-radius: 8px;
              font-size: min(var(--font_size_3), 18px);
              line-height: min(var(--line_height_3), 24px);
              margin-bottom: 20px;
              overflow: hidden;
              padding: 0px 16px;
          }
          
          .config_view .vertical-list-item {
              margin: 12px 0px;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }
          
          .config_view .horizontal-dividing-line {
              border: unset;
              margin: unset;
              height: 1px;
              background-color: rgba(127, 127, 127, 0.15);
          }
          
          .config_view .vertical-dividing-line {
              border: unset;
              margin: unset;
              width: 1px;
              background-color: rgba(127, 127, 127, 0.15);
          }
          
          .config_view .ops-btns {
              display: flex;
          }
          
          .config_view .hidden {
              display: none !important;
          }
          
          .config_view .disabled {
              pointer-events: none;
              opacity: 0.5;
          }
          
          .config_view .secondary-text {
              color: var(--text_secondary);
              font-size: min(var(--font_size_2), 16px);
              line-height: min(var(--line_height_2), 22px);
              margin-top: 4px;
          }
          
          .config_view .wrap .title {
              cursor: pointer;
              font-size: min(var(--font_size_3), 18px);
              line-height: min(var(--line_height_3), 24px);
          }
          
          .config_view .wrap .title svg {
              width: 1em;
              height: 1em;
              transform: rotate(-180deg);
              transition-duration: 0.2s;
              transition-timing-function: ease;
              transition-delay: 0s;
              transition-property: transform;
          }
          
          .config_view .wrap .title svg.is-fold {
              transform: rotate(0deg);
          }
          
          
          /* 模态框 */
          .config_view .modal-window {
              display: flex;
              justify-content: center;
              align-items: center;
              position: fixed;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 999;
              background-color: rgba(0, 0, 0, 0.5);
          }
          
          .config_view .modal-dialog {
              width: 480px;
              border-radius: 8px;
              /* Linux样式兼容：--fg_white */
              background-color: var(--bg_bottom_standard, var(--fg_white));
          }
          
          .config_view .modal-dialog header {
              font-size: 12px;
              height: 30px;
              line-height: 30px;
              text-align: center;
          }
          
          .config_view .modal-dialog main {
              padding: 0px 16px;
          }
          
          .config_view .modal-dialog main p {
              margin: 8px 0px;
          }
          
          .config_view .modal-dialog footer {
              height: 30px;
              display: flex;
              justify-content: right;
              align-items: center;
          }
          
          .config_view .modal-dialog .q-icon {
              width: 22px;
              height: 22px;
              margin: 8px;
          }
          
          
          /* 版本号 */
          .config_view .versions .wrap {
              display: flex;
              justify-content: space-between;
              padding: 16px 0px;
          }
          
          .config_view .versions .wrap>div {
              flex: 1;
              margin: 0px 10px;
              border-radius: 8px;
              text-align: center;
          }
          
          
          /* 数据目录 */
          .config_view .path .path-input {
              align-self: normal;
              flex: 1;
              border-radius: 4px;
              margin-right: 16px;
              transition: all 100ms ease-out;
          }
          
          .config_view .path .path-input:focus {
              padding-left: 5px;
              background-color: rgba(127, 127, 127, 0.1);
          }
          
          /* 选择框容器 */
          .config_view .list-ctl .ops-selects {
              display: flex;
              gap: 8px;
          }
          

          @media (prefers-color-scheme: light) {
              .text_color {
                  color: black;
              }
          }
          
          @media (prefers-color-scheme: dark) {
              .text_color {
                  color: white;
              }
          }

        </style>
      </div>
    </body>
  `;

    const parser = new DOMParser();

    const doc2 = parser.parseFromString(new_navbar_item, "text/html");
    const node2 = doc2.querySelector("body > div");

    //清空消息
    node2.querySelector("#clearDb").onclick = async () => {
        await window.anti_recall.clearDb();
    };

    //选择颜色
    const pickColor = node2.querySelector(".pick-color");
    pickColor.value = nowConfig.mainColor;
    pickColor.addEventListener("change", async (event) => {
        nowConfig.mainColor = event.target.value;
        await window.anti_recall.saveConfig(nowConfig);
    });

    //存数据库开关
    var q_switch_savedb = node2.querySelector("#switchSaveDb");

    if (nowConfig.saveDb == null || nowConfig.saveDb == true) {
        q_switch_savedb.classList.toggle("is-active");
    }

    q_switch_savedb.addEventListener("click", async () => {
        if (q_switch_savedb.classList.contains("is-active")) {
            nowConfig.saveDb = false;
        } else {
            nowConfig.saveDb = true;
        }
        q_switch_savedb.classList.toggle("is-active");
        await window.anti_recall.saveConfig(nowConfig);
    });

    //反撤回自己消息开关
    var q_switch_antiself = node2.querySelector("#switchAntiRecallSelf");

    if (nowConfig.isAntiRecallSelfMsg == true) {
        q_switch_antiself.classList.toggle("is-active");
    }

    q_switch_antiself.addEventListener("click", async () => {
        if (q_switch_antiself.classList.contains("is-active")) {
            nowConfig.isAntiRecallSelfMsg = false;
        } else {
            nowConfig.isAntiRecallSelfMsg = true;
        }
        q_switch_antiself.classList.toggle("is-active");
        await window.anti_recall.saveConfig(nowConfig);
    });

    //阴影开关
    var q_switch_shadow = node2.querySelector("#switchShadow");

    if (nowConfig.enableShadow == null || nowConfig.enableShadow == true) {
        q_switch_shadow.classList.toggle("is-active");
    }

    q_switch_shadow.addEventListener("click", async () => {
        if (q_switch_shadow.classList.contains("is-active")) {
            nowConfig.enableShadow = false;
        } else {
            nowConfig.enableShadow = true;
        }
        q_switch_shadow.classList.toggle("is-active");
        await window.anti_recall.saveConfig(nowConfig);
    });

    //提示开关
    var q_switch_tip = node2.querySelector("#switchTip");

    if (nowConfig.enableTip == null || nowConfig.enableTip == true) {
        q_switch_tip.classList.toggle("is-active");
    }

    q_switch_tip.addEventListener("click", async () => {
        if (q_switch_tip.classList.contains("is-active")) {
            //取消
            nowConfig.enableTip = false;
        } else {
            //重新设置
            nowConfig.enableTip = true;
        }
        q_switch_tip.classList.toggle("is-active");
        await window.anti_recall.saveConfig(nowConfig);
    });

    view.appendChild(node2);
}

async function patchCss() {
    nowConfig = await window.anti_recall.getNowConfig();

    var cssNode = document
        .evaluate("/html/head/style[@id='anti-recall-css']", document)
        .iterateNext();
    if (cssNode) {
        cssNode.parentElement.removeChild(cssNode);
    }
    var stylee = document.createElement("style");
    stylee.type = "text/css";
    stylee.id = "anti-recall-css";
    var sHtml = `.message-content-recalled-parent {
                    border-radius: 10px;
                    position: relative;
                    ${nowConfig.enableTip == true ? "margin-bottom: 15px;" : ""}
                    overflow: unset !important;`;
    if (nowConfig.enableShadow == true) {
        sHtml += `  margin-top:3px;
                    margin-left:3px;
                    margin-right:3px;
                    box-shadow: 0px 0px 20px 5px ${nowConfig.mainColor};`;
    }
    sHtml += `                }
            .message-content-recalled {
                position: absolute;
                top: calc(100% + 6px);
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
                color:${nowConfig.mainColor};
            }
        `;
    stylee.innerHTML = sHtml;
    document.getElementsByTagName("head").item(0).appendChild(stylee);
}

export async function onLoad() {
    anti_recall.repatchCss(async (event, _) => {
        await patchCss();
    });

    //消息更新回调
    anti_recall.recallTip(async (event, msgId) => {
        console.log("[Anti-Recall]", "尝试反撤回消息ID", msgId);

        var oldElement = document.getElementById(
            `${msgId}-msgContainerMsgContent`
        );

        var newElement = document.getElementById(`${msgId}-msgContent`);

        var unixElement = document
            .getElementById(`ml-${msgId}`)
            ?.querySelector(".msg-content-container");

        var cardElement = document.getElementById(`${msgId}-msgContent`);

        var arkElement = document.getElementById(
            `ark-msg-content-container_${msgId}`
        );

        if (oldElement != null) {
            if (oldElement.classList.contains("gray-tip-message")) return;
            await appendRecalledTag(oldElement);
        } else if (newElement != null) {
            if (newElement.classList.contains("gray-tip-message")) return;
            await appendRecalledTag(newElement.parentElement);
        } else if (unixElement != null) {
            if (unixElement.classList.contains("gray-tip-message")) return;
            await appendRecalledTag(unixElement.parentElement);
        } else if (cardElement != null) {
            if (cardElement.classList.contains("gray-tip-message")) return;
            await appendRecalledTag(cardElement.parentElement);
        } else if (arkElement != null) {
            if (arkElement.classList.contains("gray-tip-message")) return;
            await appendRecalledTag(arkElement.parentElement);
        }
    });
    //消息列表更新回调
    anti_recall.recallTipList(async (event, msgIdList) => {
        recalledMsgList = msgIdList;
        await render();
    });

    await patchCss();

    var observerRendering = false;
    //监控消息列表，如果有撤回则渲染
    const observer = new MutationObserver(async (mutationsList) => {
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
                    if (observerRendering) continue;
                    observerRendering = true;
                    setTimeout(() => {
                        observerRendering = false;
                        render();
                    }, 50);
                }
            }
        }
    });

    var finder = setInterval(() => {
        if (document.querySelector(".ml-list.list")) {
            clearInterval(finder);
            console.log(
                "[Anti-Recall]",
                "检测到聊天区域，已在当前页面加载反撤回"
            );
            const targetNode = document.querySelector(".ml-list.list");
            const config = {
                attributes: false,
                childList: true,
                subtree: true
            };
            observer.observe(targetNode, config);
        }
    }, 100);

    async function render() {
        // console.log("[Anti-Recall]", "尝试反撤回消息列表", recalledMsgList);

        var elements = document
            .querySelector(".chat-msg-area__vlist")
            .querySelectorAll(".ml-item");

        nowConfig = await window.anti_recall.getNowConfig();

        for (var el of elements) {
            var findMsgId = recalledMsgList.find((i) => i == el.id);
            if (findMsgId != null) {
                var msgId = findMsgId;
                try {
                    var oldElement = el.querySelector(
                        `div[id='${msgId}-msgContainerMsgContent']`
                    );

                    var newElement = el.querySelector(
                        `div[id='${msgId}-msgContent']`
                    );

                    var unixElement = el
                        .querySelector(`div[id='ml-${msgId}']`)
                        ?.querySelector(".msg-content-container");

                    var cardElement = el.querySelector(
                        `div[id='${msgId}-msgContent']`
                    );

                    var arkElement = el.querySelector(
                        `div[id='ark-msg-content-container_${msgId}']`
                    );

                    if (oldElement != null) {
                        if (oldElement.classList.contains("gray-tip-message"))
                            continue;
                        await appendRecalledTag(oldElement);
                    } else if (newElement != null) {
                        if (newElement.classList.contains("gray-tip-message"))
                            continue;
                        await appendRecalledTag(newElement.parentElement);
                    } else if (unixElement != null) {
                        if (unixElement.classList.contains("gray-tip-message"))
                            continue;
                        await appendRecalledTag(unixElement.parentElement);
                    } else if (cardElement != null) {
                        if (cardElement.classList.contains("gray-tip-message"))
                            continue;
                        await appendRecalledTag(cardElement.parentElement);
                    } else if (arkElement != null) {
                        if (arkElement.classList.contains("gray-tip-message"))
                            continue;
                        await appendRecalledTag(arkElement.parentElement);
                    }
                } catch (e) {
                    console.log("[Anti-Recall]", "反撤回消息时出错", e);
                }
            }
        }
    }

    async function appendRecalledTag(msgElement) {
        if (!msgElement) return;

        var currRecalledTip = msgElement.querySelector(
            ".message-content-recalled"
        );
        if (currRecalledTip == null) {
            msgElement.classList.add("message-content-recalled-parent");

            if (nowConfig.enableTip == true) {
                const recalledEl = document.createElement("div");
                recalledEl.innerText = "已撤回";
                recalledEl.classList.add("message-content-recalled");

                msgElement.appendChild(recalledEl);
                setTimeout(() => {
                    recalledEl.style.transform = "translateX(0)";
                    recalledEl.style.opacity = "1";
                }, 5);
            }
        } else {
            //已经有撤回标记了，不再重复添加
        }
    }
}
