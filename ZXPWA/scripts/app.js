(function () {
    'use strict';

    var app = {
        currentColumn: 0,
        isFirstRequest: true,
        //querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素。
        //获取文档中 class="button1" 的第一个元素
        appColumn1: document.querySelector('.button1'),
        appColumn2: document.querySelector('.button2'),
        appColumn3: document.querySelector('.button3'),
        container: document.querySelector('.post-list-body'),
    };

    //将app设置为全局变量
    window.app = app;

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    document.getElementById('column1').addEventListener('click', function () {
        app.updateColumn(1);
    });
    document.getElementById('column2').addEventListener('click', function () {
        app.updateColumn(2);
    });
    document.getElementById('column3').addEventListener('click', function () {
        app.updateColumn(3);
    });

    document.getElementById('butAbout').addEventListener('click', function () {

    });


    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     * 选中底部tab的执行方法
     *
     ****************************************************************************/

    app.updateColumn = function (index) {
        if (app.currentColumn !== index) {
            app.appColumn1.classList.remove('active');
            app.appColumn2.classList.remove('active');
            app.appColumn3.classList.remove('active');
            switch (index) {
                case 1:
                    firstTab.showPage();
                    app.appColumn1.classList.add('active');
                    break;
                case 2:
                    secondTab.requestBlogList();
                    app.appColumn2.classList.add('active');
                    break;
                case 3:
                    // app.requestBlogList();
                    app.appColumn3.classList.add('active');
                    break;
            }
            app.currentColumn = index;
        }
    };

    //默认选中第一个tab
    app.updateColumn(1);


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            ///PWA/ZXPWA/api/download.json
            //这里不是相对路径的js，而是最终网络请求可以访问到的url路径
            .register('/PWA/ZXPWA/service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch(function (error) {
                console.log(error);
            })
        ;
    }

})();
