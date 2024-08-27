/**
 * @since 2023-05-10 图标点击事件
 */
chrome.action.onClicked.addListener((tab) => {
    /**
     * @since 2023-05-10 打开页面
     */
    let url = chrome.runtime.getURL("newtab.html");
    chrome.tabs.create({ url });
});

/**
 * @since 2024-08-06 安装成功显示首页
 */
chrome.runtime.onInstalled.addListener(function() {
    let url = chrome.runtime.getURL("newtab.html");
    chrome.tabs.create({ url: url });
});

/**
 * @since 2024-08-26 监听下载事件
 */
// background.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "LoadIcon") {
        LoadIcon(message.payload);
        sendResponse({status: "ok"});
    } else {
        sendResponse({status: "Unknow message.type"});
    }
    return true;
});

/**
 * @title 下载大图Icon
 * @author start2004
 * @since 2024-08-26
 *
 * @param {object} hostObject 域名对象集合
 */
async function LoadIcon(hostObject) {
    /**
     * @since 2024-08-26 防止并发
     */
    const run = await IsRun();
    // console.log(run);
    if(run === false) return ;

    /**
     * @since 2024-08-27 防止默认图
     */
    const apiUrl = "https://favicon.im/127.0.0.1?larger=true";
    const defaultBase64String = await FetchImageBase64String(apiUrl);

    /**
     * @since 2024-08-27 下载icon
     */
    for(let host in hostObject){
        FetchIcon(host, defaultBase64String);
    }
}

/**
 * @title 是否执行代码
 * @author start2004
 * @since 2024-08-26
 */
async function IsRun(){
    const key = "last-run-time";
    const time = await GetStorage(key);
    const currentTime = parseInt(new Date().getTime()/1000);
    // console.log(time);

    /**
     * @since 2024-08-26 第一次或者超过60秒才执行，防止并发
     */
    let result = false;
    if(time === undefined || currentTime-time >= 60){
        result = true;

        /**
         * @since 2024-08-26 写入当前时间
         */
        await SetStorage(key, currentTime);
    } else {}

    return result;
}

/**
 * @title 下载网站icon
 * @author start2004
 * @since 2024-08-26
 *
 * @param {string} host 域名
 * @param {string} defaultBase64String 默认图片内容
 */
async function FetchIcon(host, defaultBase64String){
    /**
     * @since 2024-08-26 缓存key
     */
    const key = "icon:"+ host;
    let iconObject;

    /**
     * @since 2024-08-26 icon接口
     */
    const apiUrl = "https://favicon.im/"+ host +"?larger=true";
    let base64String = await FetchImageBase64String(apiUrl);
    if(base64String == defaultBase64String){
        base64String = "";
    } else {
        /**
         * @since 2024-08-27 获取内容失败，查找上一次存储的图片数据
        */
        if(base64String == ""){
            iconObject = await GetStorage(key);
            if(iconObject !== undefined){
                base64String = iconObject["base64String"];
            } else {}
        } else {}
    }

    /**
     * @since 2024-08-26 写入缓存
     */
    const currentTime = parseInt(new Date().getTime()/1000);
    iconObject = {
        "host": host,
        "updateTime": currentTime,
        "base64String": base64String,
    };
    await SetStorage(key, iconObject);
    // console.log(iconObject);
}

/**
 * @title 下载图片base64string
 * @author start2004
 * @since 2024-08-26
 *
 * @param {string} url 图片URL地址
 */
async function FetchImageBase64String(url) {
    try {
        // 发起fetch请求获取图片
        const response = await fetch(url);
        if (!response.ok) {
            return "";
            // throw new Error(url, `Network response was not ok: ${response.status}`);
        } else {
            // 将响应转换为blob
            const blob = await response.blob();

            // 使用FileReader读取blob数据并转换为base64
            const reader = new FileReader();
            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    // 读取完后获得Base64字符串
                    const base64String = reader.result;
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob); // 将Blob转换为Base64
            });
        }
    } catch (error) {
        return "";
        // console.error(url, 'There was a problem with the fetch operation:', error);
        // throw error; // 抛出错误以便调用者可以处理
    }
}

/**
 * @title 更新缓存
 * @author start2004
 * @since 2024-08-14
 *
 * @param  {string} key 键值
 * @param {string|object} data 缓存数据
 */
function SetStorage(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

/**
 * @title 获取缓存
 * @author start2004
 * @since 2024-08-14
 *
 * @return {mixed} 缓存数据
 */
function GetStorage(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[key]);
            }
        });
    });
}