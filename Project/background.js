//默认宽度
let default_style = {
    maincolumn_width: 65, //单位为rem
    img_max_width: 90  //单位为%
}

//当前样式属性值，深拷贝，先初始化为默认值，后续再根据本地存储的数据进行修改
let current_style = JSON.parse(JSON.stringify(default_style))

//检查和设置本地存储的数据
chrome.storage.local.get('current_maincolumn_width', function (result) {
    //值已经存在
    if (result.current_maincolumn_width) {
        current_style.maincolumn_width = result.current_maincolumn_width
        console.log('current_maincolumn_width existed, value is ' + result.current_maincolumn_width);
    }
    //值不存在
    else {
        chrome.storage.local.set({ 'current_maincolumn_width': default_style.maincolumn_width })
        console.log('setup current_maincolumn_width, value is' + default_style.maincolumn_width);
    }
});
chrome.storage.local.get('current_img_max_width', function (result) {
    //值已经存在
    if (result.current_img_max_width) {
        current_style.img_max_width = result.current_img_max_width
        console.log('current_img_max_width existed, value is ' + result.current_img_max_width);
    }
    //值不存在
    else {
        chrome.storage.local.set({ 'current_img_max_width': default_style.img_max_width })
        console.log('setup current_img_max_width, value is ' + default_style.img_max_width);
    }
});

//监听其他js发送过来的事件
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        // 打开/刷新页面时
        case "content js-initial_css_injection":
            chrome.scripting.insertCSS({  //注入含有变量的css
                target: {
                    tabId: sender.tab.id,
                },
                css: getVariableCSS(current_style)
            });
            chrome.scripting.insertCSS({  //注入固定css
                target: {
                    tabId: sender.tab.id,
                },
                files: ["new-zhihu-style.css"]
            });
            break;
        // popup页面被打开时
        case "popup js-initialize":
            sendResponse(current_style)
            break;
        // main column宽度值发生变化时
        case "popup js-maincolumn_width_change":
            current_style.maincolumn_width = message.new_value
            updateAllTabsToCurrentStyle()
            chrome.storage.local.set({ 'current_maincolumn_width': message.new_value })
            break;
        // 内容图片最大宽度值发生变化时
        case "popup js-img_max_width_change":
            current_style.img_max_width = message.new_value
            updateAllTabsToCurrentStyle()
            chrome.storage.local.set({ 'current_img_max_width': message.new_value })
            break;
        // 恢复默认按钮被点击时
        case "popup js-reset":
            //对所有知乎网页的tab进行操作
            chrome.tabs.query({ url: "*://*.zhihu.com/*" }, function (tabs) {
                for (let tab of tabs) {  // tabs是一个数组，包含所有符合条件的tab对象
                    chrome.scripting.insertCSS({
                        target: {
                            tabId: tab.id,
                        },
                        css: getVariableCSS(default_style),
                    });
                }
            })
            chrome.storage.local.set({ 'current_maincolumn_width': default_style.maincolumn_width })
            chrome.storage.local.set({ 'current_img_max_width': default_style.img_max_width })
            sendResponse(default_style)
    }
})

function updateAllTabsToCurrentStyle() {
    //对所有知乎网页的tab进行操作
    chrome.tabs.query({ url: "*://*.zhihu.com/*" }, function (tabs) {
        for (let tab of tabs) {  // tabs是一个数组，包含所有符合条件的tab对象
            chrome.scripting.insertCSS({
                target: {
                    tabId: tab.id,
                },
                css: getVariableCSS(current_style)
            });
        }
    })
}

function getVariableCSS(current_style_obj) {
    return `:root {
        /* 主栏的宽度 */
        --width-main-column: ${current_style_obj.maincolumn_width}rem;
        /* 侧栏的宽度 */
        --width-side-column: 17rem;
        /* 主栏与侧栏直接的间距 */
        --gap: 2rem;
        /* 整个主内容容器的宽度 */
        --width-container: calc(var(--width-main-column) + var(--width-side-column) + var(--gap));
        /* 文章内容图片的最大宽度 */
        --max-width-content-img: ${current_style_obj.img_max_width}%;
    }`
}


console.log(new Date(), "background.js loaded")