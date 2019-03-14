/**
 * /src/js/index/enter.js -> index.html
 */

//适配手机屏幕布局的
import 'ijijin_builder/stylebuild/lib/mobile.less';

import '../../main.css';

//安装之后这边还要引入
import $ from '../tool/jquery.min'

//因为webpack打包的时候不会去处理内嵌到html中的js代码，如果是低版本的系统（安卓4.4）会出现一些语法不支持的问题，比如let，() => {}等问题
//webpack则会处理兼容这些问题

// 取回密匙并展示
$("#secretKey").val(localStorage.getItem("mySecretKey"));

document.getElementById("changeKey").onclick = function () {
    if (typeof(Storage) !== "undefined") {
        // 存储
        localStorage.setItem("mySecretKey", $("#secretKey").val());
    } else {
        document.getElementById("result").innerHTML = "抱歉！您的浏览器不支持 Web Storage ...";
    }

    //刷新当前网页
    location.reload();
};

//注册缓存
//一定要注意，server.js只能放到项目根目录中，放到其他目录会导致报错
//Site cannot be installed: no matching service worker detected.
// You may need to reload the page, or check that the service worker for the current page
// also controls the start URL from the manifest
if (navigator.serviceWorker != null) {
    navigator.serviceWorker.register('/PWA/GiftBookPWA/sw.js')
        .then(function (registration) {
            console.log('Registered events at scope: ', registration.scope);
        });
}


getDelayAllData(() => {
    let allData = JSON.parse(window.zxData);
    if (!allData) return;
    createAllTables(allData);
});

function getDelayAllData(completeBlock) {
    let timeRepeat = window.setInterval(() => {
        if (window.zxData) {
            completeBlock();
            window.clearInterval(timeRepeat);
        }
    }, 100);
}

function createAllTables(allData) {
    let main = document.getElementById("myBody");

    let myTotalAmount = getTotalAmount(allData, "myData");
    let myTable = getTable("我的", ["序号", "姓名", "金额", "备注"], allData.weddingData.myData, myTotalAmount);
    main.appendChild(myTable);

    let myWifeTotalAmount = getTotalAmount(allData, "myWifeData");
    let myWifeTable = getTable("老婆的", ["序号", "姓名", "金额", "备注"], allData.weddingData.myWifeData, myWifeTotalAmount);
    main.appendChild(myWifeTable);

    let otherData = allData.weddingData.otherData[0];
    let otherTable = getTable("其他", [otherData.name, otherData.amount]);
    main.appendChild(otherTable);

    let weddingTotalTable = getTable("婚礼总计", ["总金额", parseInt(myTotalAmount) + parseInt(myWifeTotalAmount) + parseInt(otherData.amount)]);
    main.appendChild(weddingTotalTable);
}

function getWeddingBottomTables(data, totalAmount) {
    let div = document.createElement('div');
    div.style.marginTop = "50px";

    let h2 = document.createElement('h2');
    h2.innerHTML = "其他";
    div.appendChild(h2);

    let table = document.createElement('table');
    table.className = "alt-rows-table";
    div.appendChild(table);

    let tr = document.createElement('tr');
    tr.innerHTML = "";
    table.appendChild(tr);

    let tableTitle = tableTitleAry[i];
    let th = document.createElement('th');
    th.innerHTML = tableTitle;
    tr.appendChild(th);
}


function getTotalAmount(allData, key) {
    let weddingData = allData.weddingData ? allData.weddingData : {};
    let handleAry = weddingData[key] ? weddingData[key] : [];
    let totalAmount = 0;
    for (let i = 0; i < handleAry.length; i++) {
        let item = handleAry[i];
        totalAmount = totalAmount + parseInt(item.amount);
    }

    return totalAmount;
}

function getTable(title, tableTitleAry, tableListAry, totalAmount) {

    if (!tableTitleAry) {
        tableTitleAry = [];
    }

    if (!tableListAry) {
        tableListAry = [];
    }

    let div = document.createElement('div');
    div.style.marginTop = "50px";

    let h2 = document.createElement('h2');
    h2.innerHTML = title;
    div.appendChild(h2);

    let table = document.createElement('table');
    table.className = "alt-rows-table";
    div.appendChild(table);

    let tr = document.createElement('tr');
    tr.innerHTML = "";
    table.appendChild(tr);

    //创建表头
    for (let i = 0; i < tableTitleAry.length; i++) {
        let tableTitle = tableTitleAry[i];
        let th = document.createElement('th');
        th.innerHTML = tableTitle;
        tr.appendChild(th);
    }


    for (let i = 0; i < tableListAry.length; i++) {
        let tableListDic = tableListAry[i];
        let row = document.createElement('tr'); //创建行
        table.appendChild(row);

        if(i % 2 == 0){
            row.className = "even-row-color";
        }else{
            row.className = "odd-row-color";
        }

        let indexCell = document.createElement('td');
        indexCell.innerHTML = i + 1;
        row.appendChild(indexCell);

        let nameCell = document.createElement('td');
        nameCell.innerHTML = tableListDic.name;
        row.appendChild(nameCell);

        let amountCell = document.createElement('td');
        amountCell.innerHTML = tableListDic.amount;
        row.appendChild(amountCell);

        let markCell = document.createElement('td');
        markCell.style.color = "#fe5d4e";
        let markInfo = "";
        if (parseInt(tableListDic.state) === 1) {
            markInfo = "";
        } else if (parseInt(tableListDic.state) === 2) {
            markInfo = "已清";
        }
        markCell.innerHTML = markInfo;
        row.appendChild(markCell);
    }

    if (parseInt(totalAmount) > 0) {
        let row = document.createElement('tr');
        table.appendChild(row);

        row.className = "odd-row-color";

        let nameCell = document.createElement('td');
        nameCell.innerHTML = "总金额";
        row.appendChild(nameCell);

        let amountCell1 = document.createElement('td');
        //不能将s设置成小写的,否则失效
        amountCell1.colSpan = "3";
        amountCell1.innerHTML = totalAmount;
        row.appendChild(amountCell1);
    }

    return div;
}


//.html()用为读取和修改元素的HTML标签
// $("#first-date").html(today);
// $("#sec-date").html(today);

