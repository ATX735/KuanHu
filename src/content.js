// 打开/刷新页面时运行


chrome.runtime.sendMessage(
    {
        type: "content js-initial_css_injection"
    }
)
