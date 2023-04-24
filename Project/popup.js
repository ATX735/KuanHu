//获取页面元素
let maincolumn_width_input = document.getElementById("maincolumn-range");
let maincolumn_width_span = document.getElementById("maincolumn-width-span");
let img_max_width_input = document.getElementById("img-range");
let img_max_width_span = document.getElementById("img-max-width-span");
let reset_btn = document.getElementById("reset-btn");

//设置事件响应
maincolumn_width_input.oninput = onMainColumnWidthChange;
img_max_width_input.oninput = onImgMaxWidthChange;
reset_btn.onclick = reset;


//设置初始值
chrome.runtime.sendMessage(
    {
        type: "popup js-initialize",
    },
    //返回消息
    async (current_style) => {
        maincolumn_width_input.value = current_style.maincolumn_width;
        maincolumn_width_span.innerHTML = current_style.maincolumn_width;
        img_max_width_input.value = current_style.img_max_width;
        img_max_width_span.innerHTML = current_style.img_max_width;
    }
)


function onMainColumnWidthChange() {
    maincolumn_width_span.innerHTML = maincolumn_width_input.value;
    chrome.runtime.sendMessage(
        {
            type: "popup js-maincolumn_width_change",
            new_value: maincolumn_width_input.value
        }
    )
}

function onImgMaxWidthChange() {
    img_max_width_span.innerHTML = img_max_width_input.value;
    chrome.runtime.sendMessage(
        {
            type: "popup js-img_max_width_change",
            new_value: img_max_width_input.value
        }
    )
}

//将插件的设置恢复为默认
function reset() {
    chrome.runtime.sendMessage(
        {
            type: "popup js-reset",
        },
        //返回消息
        async (default_style) => {
            //恢复popup页面元素为默认值
            maincolumn_width_input.value = default_style.maincolumn_width;
            maincolumn_width_span.innerHTML = default_style.maincolumn_width;
            img_max_width_input.value = default_style.img_max_width;
            img_max_width_span.innerHTML = default_style.img_max_width;
        }
    )
}
