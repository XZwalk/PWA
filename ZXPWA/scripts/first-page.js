

function showFirstPage() {
    // 使用createElement创建元素
    var dialog = document.createElement('div');
    var img = document.createElement('img');
    var btn = document.createElement('input');
    var content = document.createElement('span');
// 添加class
    dialog.className = 'dialog';
// 属性
//     img.src = 'close.gif';
// 样式
    btn.style.paddingRight = '10px';
// 文本
    content.innerHTML = '您真的要GG吗？';
// 在容器元素中放入其他元素
    dialog.appendChild(img);
    dialog.appendChild(btn);
    dialog.appendChild(content);

    return dialog;
}