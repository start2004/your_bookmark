/**
 * @since 2023-05-10 主入口
 */
$(function(){
    Main();
});

/**
 * @title 主函数
 * @author start2004
 * @since 2024-08-27
 */
async function Main(){
    /**
     * @since 2024-08-02 首页title
     */
    $("title").text(chrome.i18n.getMessage("extension_name"));

    /**
     * @since 2023-05-11 处理搜素框
     */
    await SpiderSearch();

    /**
     * @since 2023-05-12 显示顶部
     */
    $(".head").show();

    /**
     * @since 2024-08-27 处理书签信息
     */
    await ShowBookmarks();

    /**
     * @since 2023-05-12 显示底部
     */
    $(".foot").show();
}

/**
 * ===============================================================
 * 分隔符
 * ===============================================================
 */

/**
 * @since 2023-05-11 搜索框处理
 */
async function SpiderSearch(){
    /**
     * @since 2023-05-15 搜索按钮的图片
     */
    const spiderObj = await GetSpider();
    $(".spider-btn img").attr("src", "image/"+ spiderObj.spider +"_128.png");

    /**
     * @since 2023-05-15 搜索框的提示文字
     */
    $(".search-text").attr("placeholder", chrome.i18n.getMessage("search_prompt"));

    /**
     * @since 2024-08-01 加载-更多搜索引擎选项div
     */
    let htmlArray = new Array();
    const spiderArray = chrome.i18n.getMessage("spider").split(",");
    for(let i=0; i<spiderArray.length; i++){
        let spider = spiderArray[i];
        let html = '<li id="'+ spider +'" style="background-image: url(\'image/'+ spider +'_128.png\');" title="'+ chrome.i18n.getMessage(spider+ "_search") +'">'+ chrome.i18n.getMessage(spider) +'</li>';
        htmlArray.push(html);
    }
    const html = '<ul class="list-inline">' + htmlArray.join('') + '</ul>';
    $(".search-tip.img-rounded").html(html);
    // $(".search-tip").show();

    /**
     * @since 2023-05-11 监听搜索图标
     */
    $(".spider-btn img").on("click", function() {
        OpenSpiderURL("", true);
    });

    /**
     * @since 2023-05-15 监听更多搜索引擎图标
     */
    $(".search-tip li").on("click", function() {
        OpenSpiderURL(this.id, false);
    });

    /**
     * @since 2023-05-11 监听搜索框回车按键
     */
    $("#search-word").keydown(function(event) {
        if (event.keyCode == 13) {
            OpenSpiderURL("", false);
        } else {}
    });

    /**
     * @since 2023-05-15 光标定位文本框，显示更多搜索引擎选项div
     */
    $("#search-word").on("focus", function () {
        $(".search-tip").fadeIn("slow");
    });

    /**
     * @since 2023-05-11 光标离开，关闭更多搜索引擎选项div
     */
    $("#search-word").on("blur", function () {
        setTimeout(function (){
            $(".search-tip").fadeOut("slow");
        }, 300);
    });
}

/**
 * @title 获取用户设置的搜索引擎
 * @author start2004
 * @since 2024-08-27
 */
async function GetSpider(){
    /**
     * @since 2023-05-15 读取缓存
     * @since 2024-08-27 localStorage换成chrome.storage.local，过渡一下
     */
    let key = "bookmark-spider";
    let spider = await GetStorage(key);
    if(typeof spider !== "string"){
        spider = localStorage.getItem(key);
    } else {}
    // console.log(spider);

    /**
     * @return
     */
    return GetSpiderObject(spider);
}

/**
 * @title 设置搜索引擎
 * @author start2004
 * @since 2024-08-27
 */
function SetSpider(spider){
    let key = "bookmark-spider";

    /**
     * @since 2023-05-12 更新缓存
     */
    SetStorage(key, spider);

    /**
     * @return
     */
    return GetSpiderObject(spider);
}

/**
 * @title 返回搜索引擎对象
 * @author start2004
 * @since 2024-08-27
 *
 * @param {string} spider 搜索引擎名称
 * @return {object} 搜索引擎对象
 */
function GetSpiderObject(spider){
    /**
     * @since 2024-08-06 spider第一次不存在返回null
     * @since 2023-05-15 默认google
     */
    if(typeof spider !== "string" || spider =="" || chrome.i18n.getMessage(spider) == ""){
        spider = "google";
    } else {}
    const spiderObj = {
        "spider":spider,
        "url":chrome.i18n.getMessage(spider +"_url"),
        "urlSearch":chrome.i18n.getMessage(spider +"_search_url"),
    };
    // console.log(spider);
    return spiderObj;
}

/**
 * @title 跳转搜索页面
 * @author start2004
 * @since 2024-08-27
 */
async function OpenSpiderURL(spider, jump){
    /**
     * @since 2023-05-12 无指定搜索引擎
     */
    let spiderObj = {};
    if (spider == ""){
        /**
         * @since 2023-05-12 读取缓存
         */
        spiderObj = await GetSpider();
    } else {
        /**
         * @since 2023-05-12 更新缓存
         */
        spiderObj = SetSpider(spider);
    }
    // console.log(spiderObj);

    /**
     * @since 2023-05-15 修改图片
     */
    $(".spider-btn img").attr("src", "image/"+ spiderObj.spider +"_128.png");

    /**
     * @since 2023-05-11 关键词为空
     */
    let searchWord = $("#search-word").val();
    if(searchWord == ""){
        if(!jump){
            /**
             * @since 2023-05-11 不跳转，光标离开事件或点击图标，选择搜索引擎
             */
            return false;
        } else {
            /**
             * @since 2023-05-11 访问主页
             */
            let url = spiderObj.url;
            window.open(url);
        }
    } else {
        /**
         * @since 2023-05-11 打开搜索
         */
        let url = spiderObj.urlSearch + encodeURIComponent(searchWord);
        window.open(url);
    }
}

/**
 * ===============================================================
 * 分隔符
 * ===============================================================
 */

/**
 * @title 展示书签信息
 * @author start2004
 * @since 2024-08-27
 */
async function ShowBookmarks(){
    /**
     * @since 2024-08-27 获取书签
     */
    const bookmarksArray = await GetBookmarks();
    // console.log(bookmarksArray);

    /**
     * @since 2024-08-27 书签信息分组
     */
    let groupBookmarksArray = GetGroupBookmarks(bookmarksArray);
    // console.log(groupBookmarksArray);

    /**
     * @since 2024-08-27 置顶书签，增加额外书签，chrome自带工具
     */
    groupBookmarksArray[0] = AddChromeToolBookmarks(groupBookmarksArray[0]);
    // console.log(groupBookmarksArray);

    /**
     * @since 2024-08-27 获取书签代码
     */
    const [bookmarksHtml, hostObject] = await GetBookmarksHtml(groupBookmarksArray);
    // console.log(bookmarksHtml);
    // console.log(hostObject);
    $("#container").html(bookmarksHtml);

    /**
     * @since 2024-08-27 增加监听事件
     */
    ListenBookmarks();

    /**
     * @since 2024-08-27 下载icon大图
     */
    LoadIcon(hostObject);
}

/**
 * @title 获取书签信息
 * @author start2004
 * @since 2024-08-27
 */
function GetBookmarks() {
    return new Promise((resolve, reject) => {
        chrome.bookmarks.getTree(function(bookmarkTree) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                // console.log(bookmarkTree);
                resolve(bookmarkTree[0]["children"][0]["children"]);
            }
        });
    });
}

/**
 * @title 书签信息分组
 * @author start2004
 * @since 2024-08-27
 *
 * @param {array} bookmarksArray 初始书签信息
 * @return {array} 书签分组信息
 */
function GetGroupBookmarks(bookmarksArray){
    /**
     * @since 2024-08-27 遍历书签，分组
     * @since 2024-08-27 书签栏置顶书签
     * @since 2024-08-27 书签栏一级文件夹里的书签
     */
    let groupBookmarksArray = new Array();
    groupBookmarksArray.push({
        "groupName": "", // 置顶书签
        "bookmarks": new Array(),
    });
    for(let i in bookmarksArray){
        let bArray = bookmarksArray[i];

        /**
         * @since 2024-08-27 书签栏置顶书签
         */
        if(bArray["children"] === undefined){
            groupBookmarksArray[0]["bookmarks"].push({
                "title": bArray["title"],
                "url": bArray["url"],
            });
        } else {
            /**
             * @since 2024-08-27 书签栏一级文件夹
             */
            let folderName = bArray["title"];
            let gArray = new Array();
            let cArray = bArray["children"];
            for(let j in cArray){
                if(cArray[j]["children"] === undefined){
                    gArray.push({
                        "title": cArray[j]["title"],
                        "url": cArray[j]["url"],
                    });
                } else {
                    /**
                     * @since 2024-08-27 二级文件夹，暂未处理
                     */
                }
            }

            /**
             * @since 2024-08-27 存在书签信息
             */
            if(gArray.length > 0){
                groupBookmarksArray.push({
                    "groupName": folderName,
                    "bookmarks": gArray,
                });
            } else {}
        }
    }

    return groupBookmarksArray;
}

/**
 * @title 添加Chrome浏览器工具书签
 * @author start2004
 * @since 2024-08-27
 *
 * @param {object} topBookmarksObject 置顶书签对象
 * @return {object}
 */
function AddChromeToolBookmarks(topBookmarksObject){
    /**
     * @since 2024-08-27 chrome工具
     */
    const chromeToolArray = new Array(
        {
            title: chrome.i18n.getMessage("extension_store"), // 应用商店
            url: chrome.i18n.getMessage("extension_store_url")
        },
        {
            title: chrome.i18n.getMessage("extension"), // 扩展
            url: 'chrome://extensions/'
        },
        {
            title: chrome.i18n.getMessage("favorites"), // 书签
            url: 'chrome://bookmarks/'
        },
        {
            title: chrome.i18n.getMessage("apps"), // 应用
            url: 'chrome://apps/'
        },
        {
            title: chrome.i18n.getMessage("settings"), // 设置
            url: 'chrome://settings/profiles'
        },
        {
            title: chrome.i18n.getMessage("downloads"), // 下载记录
            url: 'chrome://downloads'
        },
        {
            title: chrome.i18n.getMessage("history"), // 历史记录
            url: 'chrome://history'
        },
        {
            title: chrome.i18n.getMessage("clear_browser_data"), // 删除浏览数据
            url: 'chrome://settings/clearBrowserData'
        },
        {
            title: chrome.i18n.getMessage("version"), // 版本
            url: 'chrome://settings/help'
        }
    );

    for(let i=0; i<chromeToolArray.length; i++){
        topBookmarksObject["bookmarks"].push(chromeToolArray[i]);
    }
    return topBookmarksObject;
}

/**
 * @title 获取标签代码
 * @author start2004
 * @since 2024-08-27
 *
 * @param {array} groupBookmarksArray 书签信息
 * @return {string} 拼接好的书签html代码
 */
async function GetBookmarksHtml(groupBookmarksArray){
    /**
     * @since 2024-08-26 模板
     */
    const mainTemplateHtml = '<div class="main"><h4>{$groupName}</h4><ul id="bookmark" class="list-inline">&nbsp;</ul></div>',
        bookmarkTemplateHtml = '<li><a href="{$url}"><div><img src="{$icon}" width="32" height="32" class="img-rounded center-block bookmark-image icon-{$host}"></div><div class="link_text">{$title}</div></a></li>';

    /**
     * @since 2024-08-27 当前时间
     */
    const currentTime = parseInt(new Date().getTime()/1000);

    /**
     * @since 2024-08-27 遍历分组
     */
    let groupHtmlArray = new Array(), hostObject = {};
    for(let i in groupBookmarksArray){
        let html, htmlArray = new Array();

        /**
         * @since 2024-08-27 遍历组内书签
         */
        for(let j in groupBookmarksArray[i]["bookmarks"]){
            let bookmarkObject = groupBookmarksArray[i]["bookmarks"][j];

            /**
             * @since 2024-08-27 获取host
             * @since 2024-08-27 获取缓存大图icon
             */
            const urlObject = new URL(bookmarkObject["url"]);
            let icon = "";
            if(urlObject["protocol"] == "http:" || urlObject["protocol"] == "https:"){
                let host = urlObject.host;
                bookmarkObject["host"] = host.replaceAll(".", "-");

                /**
                 * @since 2024-08-27 读取缓存
                 */
                let iconObject = await GetStorage("icon:"+host);
                // console.log(iconObject);
                if(iconObject !== undefined){
                    icon = iconObject["base64String"];

                    /**
                     * @since 2024-08-27 超过30天，更新icon
                     */
                    if(currentTime-iconObject["updateTime"] >= 30*86400){
                        hostObject[host] = true;
                    } else {}
                } else {
                    hostObject[host] = true;
                }
            } else {
                bookmarkObject["host"] = "";
            }

            /**
             * @since 2023-05-09 处理图标
             * @since 2023-05-10 获取网站的favicon
             */
            if(icon == ""){
                const iconURL = new URL(chrome.runtime.getURL("/_favicon/"));
                iconURL.searchParams.set("pageUrl",bookmarkObject["url"]);
                iconURL.searchParams.set("size", "32");
                icon = iconURL.toString();
            } else {}
            bookmarkObject["icon"] = icon;

            /**
             * @since 2024-08-27 替换key
             */
            html = bookmarkTemplateHtml;
            for(let k in bookmarkObject){
                html = html.replaceAll("{$"+ k +"}", bookmarkObject[k]);
            }
            htmlArray.push(html);
        }

        /**
         * @since 2024-08-27 一组书签的html代码
         */
        html = mainTemplateHtml;
        html = html.replace("&nbsp;", htmlArray.join(""));
        html = html.replace("{$groupName}", groupBookmarksArray[i]["groupName"]);
        groupHtmlArray.push(html);
    }

    /**
     * @since 2024-08-27 拼接html代码
     */
    return [groupHtmlArray.join(""), hostObject];
}

/**
 * @title 书签增加监听事件
 * @author start2004
 * @since 2024-08-27
 */
function ListenBookmarks(){
    /**
     * @since 2023-05-10 监听a标签点击
     */
    $("#container a").on("click", function() {
        url = this.href;
        if(url.substr(0, 4) == "http"){
            return true;
        } else {
            chrome.tabs.create({ url: url });
            return false;
        }
    });

    /**
     * @since 2023-05-16 鼠标放上，修改背景图突出
     */
    $("#container li").hover(function() {
        $(this).css("background-color","#e0ffff");

        /**
         * @since 2023-05-24 显示完整的文字信息
         */
        $(this).find("div:eq(0)").css("display", "none");
        $(this).find("div:eq(1)").css("height", "52px");
    }, function (){
        $(this).css("background-color","white");

        $(this).find("div:eq(1)").css("height", "20px");
        $(this).find("div:eq(0)").css("display", "");
    });

    /**
     * @since 2024-08-27 禁止选中，防止多选，效果不好看
     */
    $("ul, li").disableSelection();
}

/**
 * @title 下载icon大图
 * @author start2004
 * @since 2024-08-27
 *
 * @param {object} hostObject 域名数组
 */
function LoadIcon(hostObject){
    const len = Object.keys(hostObject).length;
    if(len > 0){
        /**
         * @since 2024-08-27 通知background.js下载icon大图
         */
        chrome.runtime.sendMessage({type: "LoadIcon", payload: hostObject}, function(response) {
            // console.log("Received response:", response);
        });
    } else {}
}

/**
 * ===============================================================
 * 分隔符
 * ===============================================================
 */


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