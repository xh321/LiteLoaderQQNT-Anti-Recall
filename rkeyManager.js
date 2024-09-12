//摘自LLOneBot
class RkeyManager {
  serverUrl = "";
  rkeyData = {
    group_rkey: "",
    private_rkey: "",
    expired_time: 0,
  };

  constructor(serverUrl) {
    this.serverUrl = serverUrl;
  }

  async getRkey() {
    if (this.isExpired()) {
      try {
        await this.refreshRkey();
      } catch (e) {
        console.log("获取rkey失败", e);
      }
    }
    return this.rkeyData;
  }

  isExpired() {
    const now = new Date().getTime() / 1000;
    // console.log(`now: ${now}, expired_time: ${this.rkeyData.expired_time}`)
    return now > this.rkeyData.expired_time;
  }

  async refreshRkey() {
    //刷新rkey
    this.rkeyData = await this.fetchServerRkey();
  }

  async fetchServerRkey() {
    return (
      new Promise() <
      ServerRkeyData >
      ((resolve, reject) => {
        fetch(this.serverUrl)
          .then((response) => {
            if (!response.ok) {
              return reject(response.statusText); // 请求失败，返回错误信息
            }
            return response.json(); // 解析 JSON 格式的响应体
          })
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      })
    );
  }
}

module.exports.RkeyManager=RkeyManager;