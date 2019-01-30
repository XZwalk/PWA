let firstTab = {};

firstTab.data = {
  list:[
      {
          "title": "1151561",
          "des": "草豆蔻从大门口从大盲从的盲从的",
      },
      {
          "title": "1151561",
          "des": "草豆蔻从大门口从大盲从的盲从的",
      }
  ]
};

firstTab.showPage = function showFirstPage() {

    //删除当前展示内容
    while (window.app.container.childNodes[2]) {
        window.app.container.removeChild(window.app.container.childNodes[2]);
    }

    //创建新内容
    for (let i = 0; i < firstTab.data.list.length; i++) {
        let item = firstTab.createItem(firstTab.data.list[i]);
        window.app.container.appendChild(item);
    }
};

firstTab.createItem = function (itemData) {

    // 使用createElement创建元素
    let div = document.createElement('div');
    // var img = document.createElement('img');
    // var btn = document.createElement('input');
    // var content = document.createElement('span');

    let title = document.createElement('h3');
    let describe = document.createElement('p');

    title.innerHTML = itemData.title;
    describe.innerHTML = itemData.des;

// 添加class
    div.className = 'first-page-item';
// 属性
//     img.src = 'close.gif';
// 样式
//     btn.style.paddingRight = '10px';
// 文本
//     content.innerHTML = '您真的要GG吗？';
// 在容器元素中放入其他元素
    div.appendChild(title);
    div.appendChild(describe);


    return div;
};