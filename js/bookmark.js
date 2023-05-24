/**
 * @since 2023-05-10 主调入口
 */
main();

/**
 * @since 2023-05-10 入口
 */
function main(){
    /**
     * @since 2023-05-11 处理搜素框
     */
    spiderSearch();

    /**
     * @since 2023-05-12 宽度不够的，不显示便签
     */
    var width = $("body").width();
    if(width >= 900){
        /**
         * @since 2023-05-10 加载快速复制框
         */
        renderFastCopy(1);
    } else {
        $("#top").hide();
    }

    /**
     * @since 2023-05-12 显示顶部
     */
    $(".head").show();

    /**
     * @since 2023-05-09 获取收藏夹数据
     */
    chrome.bookmarks.getTree(function(itemTree){
        itemTree.forEach(function(item){
            if(item.children){
                /**
                 * @since 2023-05-09 仅处理书签栏
                 */
                processNode(item.children[0].children);
            } else {}
        });
    });
}

/**
 * ===============================================================
 */

/**
 * @since 2023-05-11 搜索框处理
 */
function spiderSearch(){
    /**
     * @since 2023-05-15 做一些减法，不要什么功能都有
     * @since 2023-05-15 不再缓存用户搜索内容
     */
    
    /**
     * @since 2023-05-11 赋值
     */
    // var key = "bookmark-search-word";
    // var value = localStorage.getItem(key);
    // if(typeof value != "undefined"){
    //     $("#search-word").val(value);
    //
    //     /**
    //      * @since 2023-05-11 用户打开页面，马上在地址栏输入网址，就会抢用户光标的情况，然后回车就打开了google搜索页面的情况
    //      */
    //     // $("#search-word").select();
    //     // $("#search-word").focus();
    // } else {
    //     // $("#search-word").focus();
    // }

    /**
     * @since 2023-05-15 初始化搜索图标
     */
    var spiderObj = getSpider();

    /**
     * @since 2023-05-15 修改图片
     */
    $(".spider-btn img").attr("src", "image/"+ spiderObj.spider +"_128.png");

    /**
     * @since 2023-05-11 监听搜索图标
     */
    $(".spider-btn img").on("click", function() {
        openSpiderURL("", true);
    });

    /**
     * @since 2023-05-15 监听其他搜索图标
     */
    $(".search-tip li").on("click", function() {
        openSpiderURL(this.id, false);
    });

    /**
     * @since 2023-05-11 监听搜索框回车按键
     */
    $("#search-word").keydown(function(event) {
        if (event.keyCode == 13) {
            openSpiderURL("", false);
        }
    });

    /**
     * @since 2023-05-15 光标定位文本框
     */
    $("#search-word").on("focus", function () {
        $(".search-tip").fadeIn("slow");
    });

    /**
     * @since 2023-05-11 光标离开
     */
    $("#search-word").on("blur", function () {
        setTimeout(function (){
            $(".search-tip").fadeOut("slow");
        }, 300);
    });
}

/**
 * @since 2023-05-15 获取搜索引擎名称
 */
function getSpider(){
    /**
     * @since 2023-05-15 读取缓存
     */
    var key = "bookmark-spider";
    var spider = localStorage.getItem(key);
    // console.log(spider);

    /**
     * @since 2023-05-15 默认google
     */
    var spiderObj = {"spider":"", "url":"", "urlSearch":""};
    switch (spider){
        case "google":
            url = "https://www.google.com/";
            urlSearch = "https://www.google.com/search?q=";
            break;
        case "baidu":
            url = "https://www.baidu.com/";
            urlSearch = "https://www.baidu.com/s?wd=";
            break;
        case "sogou":
            url = "https://sogou.com/";
            urlSearch = "https://sogou.com/web?query=";
            break;
        case "so":
            url = "https://www.so.com/";
            urlSearch = "https://www.so.com/s?q=";
            break;
        case "bing":
            url = "https://www.bing.com/";
            urlSearch = "https://www.bing.com/search?q=";
            break;
        default:
            spider = "google";
            url = "https://www.google.com/";
            urlSearch = "https://www.google.com/search?q=";
    }
    spiderObj.spider = spider;
    spiderObj.url = url;
    spiderObj.urlSearch = urlSearch;
    // console.log(spiderObj);

    /**
     * @return
     */
    return spiderObj;
}

/**
 * @since 2023-05-15 设置搜索引擎
 */
function setSpider(spider){
    var key = "bookmark-spider";

    /**
     * @since 2023-05-12 更新缓存
     */
    localStorage.setItem(key, spider);

    /**
     * @return
     */
    return getSpider();
}

/**
 * @since 2023-05-11 打开搜索页面
 */
function openSpiderURL(spider, jump){
    var searchWord = $("#search-word").val();

    /**
     * @since 2023-05-12 无指定搜索引擎
     */
    var key = "bookmark-spider";
    if (spider == ""){
        /**
         * @since 2023-05-12 读取缓存
         */
        var spiderObj = getSpider();
    } else {
        /**
         * @since 2023-05-12 更新缓存
         */
        var spiderObj = setSpider(spider);
    }
    // console.log(spiderObj);

    /**
     * @since 2023-05-15 修改图片
     */
    $(".spider-btn img").attr("src", "image/"+ spiderObj.spider +"_128.png");

    /**
     * @since 2023-05-11 关键词为空
     */
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
            var url = spiderObj.url;
        }
    } else {
        /**
         * @since 2023-05-11 打开搜索
         */
        var url = spiderObj.urlSearch+ encodeURIComponent(searchWord);
    }

    window.open(url);
}

/**
 * @since 2023-05-11 渲染快速复制框
 */
function renderFastCopy(cnt){
    /**
     * @since 2023-05-10 加载文本框
     */
    var textArray = new Array();
    var html = $("#top").html();
    for(var i=1, j=1; i<=cnt; i++){
        var textHtml = html.replace(new RegExp("{\\$key}", "g"), i);
        if(i%2==0){
            j++;
        } else {}
        if(j%2==1){
            textHtml = textHtml.replace(new RegExp("{\\$bg-color}", "g"), 'bg-color1');
        } else {
            textHtml = textHtml.replace(new RegExp("{\\$bg-color}", "g"), 'bg-color2');
        }

        textArray.push(textHtml);
    }
    html = textArray.join('');
    $("#top").html(html);

    /**
     * @since 2023-05-10 赋值
     */
    for(var i=1; i<=cnt; i++){
        /**
         * @since 2023-05-10 文本框赋值
         */
        var key = "bookmark-text"+i;
        var value = localStorage.getItem(key);
        if(typeof value != "undefined"){
            $("#"+ key).val(value);
        }
        // console.log("get "+ key +" =", value);
    }

    /**
     * @since 2023-05-10 监听光标移开，点击复制相关按钮
     */
    $(".bookmark-text").on("blur", function() {
        var key = this.id;
        updateStorage(key);
    });
    $(".bookmark-btn").on("click", function() {
        var i = this.id.substr(-1,1);
        var key = "bookmark-text" +i;
        var value = $("#"+ key).val();

        /**
         * @since 2023-05-10 复制信息
         */
        $("#"+ key).select();
        document.execCommand('copy');

        /**
         * @since 2023-05-16 不为空操作
         */
        if(value != ""){
            showCopyTip("复制成功");
        } else {
            /**
             * @since 2023-05-16 文本框为空
             */
            showCopyTip("便签无数据");
        }
    });
}

/**
 * @since 2023-05-10 更新缓存
 */
function updateStorage(key){
    var setValue = $("#"+ key).val();
    var cacheValue = localStorage.getItem(key);

    if(setValue != cacheValue){
        if(setValue == ""){
            showCopyTip("便签已清空");
        } else {
            showCopyTip("便签已保存");
        }
        localStorage.setItem(key, setValue);
    } else {}
    // console.log("set "+ key +" =", value);
}

/**
 * @since 2023-05-16 显示提示信息
 */
function showCopyTip(text){
    $(".copy-tip").html(text);
    $(".copy-tip").show();

    /**
     * @since 2023-05-16 延迟关闭
     */
    setTimeout(function (){
        $(".copy-tip").fadeOut("slow");
    }, 1000);
}

/**
 * @since 2023-05-09 处理书签
 */
function processNode(node) {
    var barArray = new Array();
    var folderArray = new Array();

    for(var key in node){
        if(node[key].url){
            barArray.push(formatData(node[key]));
        } else {
            var title = node[key].title;
            folderArray[title] = processNodeChild(node[key].children);
        }
    }

    /**
     * @since 2023-05-09 渲染数据模板
     */
    _mainTemplateHtml_ = $("#main").prop("outerHTML");
    _bookmarkTemplateHtml_ = $("#bookmark").html();
    $("#main").hide();

    /**
     * @since 2023-05-10 书签栏增加额外
     */
    barArray = improveChromeBookmark(barArray);

    /**
     * @since 2023-05-10 固定书签栏
     */
    // console.log(barArray);
    _classToggle_ = true;
    addBookmark('', barArray);

    /**
     * @since 2023-05-10 其他书签文件夹
     */
    for(var title in folderArray){
        addBookmark(title, folderArray[title]);
    }

    /**
     * @since 2023-05-10 监听a标签点击
     */
    $("#main a").on("click", function() {
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
    $("#main li").hover(function() {
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


    $("#bookmark").sortable({
        revert: true
    });
    $("ul, li").disableSelection();

    /**
     * @since 2023-05-12 显示书签和底部
     */
    $("#container").show();
    $(".foot").show();
}

/**
 * @since 2023-05-09 处理书签栏的文件夹
 */
function processNodeChild(node) {
    var barArray = new Array();

    for(var key in node){
        if(node[key].url){
            barArray.push(formatData(node[key]));
        } else {
            /**
             * @since 2023-05-09 二级文件夹不再处理
             */
        }
    }

    return barArray;
}

/**
 * @since 2023-05-09 格式化数据
 */
function formatData(node){
    var data = new Array();
    var url = node.url;
    data.title = node.title;
    data.url = url;

    /**
     * @since 2023-05-09 处理图标
     * @since 2023-05-10 获取网站的favicon
     */
    if (url == "chrome://settings/clearBrowserData"){
        data.icon = "image/clear_128.png";
    } else {
        const chromeURL = new URL(chrome.runtime.getURL("/_favicon/"));
        chromeURL.searchParams.set("pageUrl",url);
        chromeURL.searchParams.set("size", "32");
        data.icon = chromeURL.toString();
    }


    return data;
}

/**
 * @since 2023-05-10 添加书签展现html
 */
function addBookmark(groupName, bookmarkArray){
    /**
     * @since 2023-05-10 书签列表
     */
    var bookmarkHtmlArray = new Array();
    for(var key in bookmarkArray){
        var bookmarkHtml = _bookmarkTemplateHtml_.replace(new RegExp("{\\$url}", "g"), bookmarkArray[key].url);
        bookmarkHtml = bookmarkHtml.replace(new RegExp("{\\$icon}", "g"), bookmarkArray[key].icon);
        bookmarkHtml = bookmarkHtml.replace(new RegExp("{\\$title}", "g"), bookmarkArray[key].title);
        bookmarkHtml = bookmarkHtml.replace('[img', '<img');
        bookmarkHtml = bookmarkHtml.replace(']</div>', '></div>');
        // console.log(bookmarkHtml);
        bookmarkHtmlArray.push(bookmarkHtml);
    }
    html = bookmarkHtmlArray.join('');
    // console.log(bookmarkHtmlArray, html);

    /**
     * @since 2023-05-10 添加html
     */
    var mainHtml = _mainTemplateHtml_.replace(_bookmarkTemplateHtml_, html);
    mainHtml = mainHtml.replace('<h4>{$groupName}</h4>', "<h4>"+ groupName +"</h4>");
    // if(_classToggle_){
    //     _classToggle_ = false;
    //     mainHtml = mainHtml.replace(new RegExp("{\\$bg-color}", "g"), 'bg-color1');
    // } else {
    //     _classToggle_ = true;
    //     mainHtml = mainHtml.replace(new RegExp("{\\$bg-color}", "g"), 'bg-color2');
    // }
    $("#container").append(mainHtml);
}

/**
 * @since 2023-05-10 增加Chrome浏览器系统地址
 */
function improveChromeBookmark(bookmarkArray){
    var chromeArray = new Array(
        {
                title: 'Chrome商店',
                url: 'https://chrome.google.com/webstore/category/extensions?hl=zh-CN'
            },
            {
                title: 'Chrome插件',
                url: 'chrome://extensions/'
            },
            {
                title: 'Chrome书签',
                url: 'chrome://bookmarks/'
            },
            {
                title: 'Chrome应用',
                url: 'chrome://apps/'
            },
            {
                title: 'Chrome设置',
                url: 'chrome://settings/'
            },

            {
                title: '下载内容',
                url: 'chrome://downloads/'
            },
            {
                title: '历史记录',
                url: 'chrome://history/'
            },
            {
                title: '清除浏览数据',
                url: 'chrome://settings/clearBrowserData'
            }
    );

    for(var i=0; i<chromeArray.length; i=i+1){
        bookmarkArray.push(formatData(chromeArray[i]));
    }
    // console.log(bookmarkArray);

    return bookmarkArray;
}