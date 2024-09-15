//大部分摘自LLOneBot
const { RkeyManager } = require("./rkeyManager.js");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const IMAGE_HTTP_HOST = "https://gchat.qpic.cn";
const IMAGE_HTTP_HOST_NT = "https://multimedia.nt.qq.com.cn";

class ImgDownloader {
  constructor() {
    this.rkeyManager = new RkeyManager("https://llob.linyuchen.net/rkey");
  }

  async getImageUrl(element) {
    if (!element) {
      return "";
    }
    const url = element.originImageUrl; // 没有域名
    const md5HexStr = element.md5HexStr;
    if (url) {
      const parsedUrl = new URL(IMAGE_HTTP_HOST + url); //临时解析拼接
      const imageAppid = parsedUrl.searchParams.get("appid");
      const isNewPic = imageAppid && ["1406", "1407"].includes(imageAppid);
      if (isNewPic) {
        let rkey = parsedUrl.searchParams.get("rkey");
        if (rkey) {
          return IMAGE_HTTP_HOST_NT + url;
        }
        const rkeyData = await this.rkeyManager.getRkey();
        rkey =
          imageAppid === "1406" ? rkeyData.private_rkey : rkeyData.group_rkey;
        return IMAGE_HTTP_HOST_NT + url + rkey;
      } else {
        // 老的图片url，不需要rkey
        return IMAGE_HTTP_HOST + url;
      }
    } else if (md5HexStr) {
      // 没有url，需要自己拼接
      return `${IMAGE_HTTP_HOST}/gchatpic_new/0/0-0-${md5HexStr.toUpperCase()}/0`;
    }
    this.output("Pic url get error:", element);
    return "";
  }

  // 下载被撤回的图片（抄自Lite-Tools）
  async downloadPic(msgItem) {
    msgItem?.elements?.forEach(async (el) => {
      if (el?.picElement) {
        const pic = el.picElement;
        const thumbMap = new Map([
          [
            0,
            pic.sourcePath,
          ],
          [
            198,
            pic.sourcePath,
          ],
          [
            720,
            pic.sourcePath,
          ],
        ]);
        const picUrl = await this.getImageUrl(el.picElement);
        this.output(
          "Download lost pic(s)... url=",
          picUrl,
          "msgId=",
          msgItem.msgId,
          "to=",
          pic.sourcePath
        );
        if (!fs.existsSync(pic.sourcePath)) {
          this.output("Download pic:", `${picUrl}`, " to ", pic.sourcePath);
          const body = await this.request(`${picUrl}`);
          fs.mkdirSync(path.dirname(pic.sourcePath), { recursive: true });
          fs.writeFileSync(pic.sourcePath, body);
        } else {
          this.output("Pic already existed, skip.", pic.sourcePath);
        }
        //需要复制原图到预览图目录
        // thumbMap.forEach(async (el, key) => {
        //   if (!fs.existsSync(el)) {
        //     this.output("Copy thumbs:", `source: ${pic.sourcePath} to ${el}`);
        //     fs.copyFile(pic.sourcePath, el);
        //   }
        // });

        // 修复本地数据中的错误
        if (
          pic?.thumbPath &&
          (pic.thumbPath instanceof Array || pic.thumbPath instanceof Object)
        ) {
          pic.thumbPath = thumbMap;
        }
      }
    });
  }

  async request(url) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith("https") ? https : http;
      const req = protocol.get(url);
      req.on("error", (error) => {
        this.output("Download error", error);
        reject(error);
      });
      req.on("response", (res) => {
        // 发生跳转就继续请求
        if (res.statusCode >= 300 && res.statusCode <= 399) {
          return resolve(this.request(res.headers.location));
        }
        const chunks = [];
        res.on("error", (error) => {
          this.output("Download error", error);
          reject(error);
        });
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      });
    });
  }

  output(...args) {
    console.log("\x1b[32m%s\x1b[0m", "Anti-Recall:", ...args);
  }
}

module.exports.ImgDownloader = ImgDownloader;
