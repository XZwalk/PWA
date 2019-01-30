(function() {
  'use strict';
  
  alert(12121);

  var app = { 
    container: document.querySelector('.post-list-body'),
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butPlus').addEventListener('click', function() {
    app.addItemContent();
  });

  document.getElementById('butCompute').addEventListener('click', function() {
    var scale = app.scale(widthAndHeight.mWidth.value, widthAndHeight.mHeight.value);
    var editTextList = app.container.getElementsByTagName('input');
    var textList = app.container.getElementsByTagName('font');
    for(var i = 0; i < editTextList.length; i++){
      var res = editTextList[i].value * scale;
      if (res % 1 == 0){
        textList[i].innerHTML = res;
      } else {
        textList[i].innerHTML = res.toFixed(1);
      }
      
    }
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.scale = function(width, height){
    if (width > height){
      var i = width;
      width = height;
      height = i;
    }

    return (height / 1920);
  }   

  app.createItem = function(){
    var template = document.querySelector('#itemTemplate').content;
    var item = template.cloneNode(true);
    return item;
  };

  app.addItemContent = function(){
    var item = app.createItem();
    app.container.appendChild(item);
  };

  app.addItemContent();

  //Service Worker 在网页已经关闭的情况下还可以运行,
  // 用来实现页面的缓存和离线, 后台通知等等功能。sw.js 文件需要在 HTML 当中引入
  //检查浏览器是否支持 service workers，如果支持，就注册 service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/px2dp-sw.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();
