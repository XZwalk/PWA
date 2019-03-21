/**
 * /src/js/index/enter.js -> index.html
 */

//适配手机屏幕布局的
// import 'ijijin_builder/stylebuild/lib/mobile.less';

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
    navigator.serviceWorker.register('/PWA/StudentDataPWA/sw.js')
        .then(function (registration) {
            console.log('Registered events at scope: ', registration.scope);
        });
}

let allData = "";
let allMonthAry = [];

getDelayAllData(() => {
    allData = JSON.parse(window.zxData);
    if (!allData) return;
    handleData(allData);
});

function getDelayAllData(completeBlock) {
    let timeRepeat = window.setInterval(() => {
        if (window.zxData) {
            completeBlock();
            window.clearInterval(timeRepeat);
        }
    }, 100);
}


function handleData(allData) {
    //找出所有月份数据
    for (let key in allData) {
        allMonthAry.push(key);
    }

    //月份数据排序
    dataSortByDate(allMonthAry);

    //创建按钮
    for (let i = 0; i < allMonthAry.length; i++) {
        let month = allMonthAry[i];
        createMonthButton(month);
    }

    //显示第一个月份数据
    handleContent(allMonthAry[0]);


    let div_update_time = document.getElementById("div_update_time");
    let newDic = allData[allMonthAry[0]];
    if (newDic && newDic["date"]) {
        div_update_time.innerHTML = "更新时间：<br>" + newDic["date"];
    } else {
        div_update_time.innerHTML = "更新时间：<br>" + "旧数据";
    }
}

//按照日期排序，直接操作的就是原数组数据
function dataSortByDate(dataAry) {
    if (dataAry && dataAry.length > 0) {
        dataAry.sort(function (obj1, obj2) {
            //日期只能比较大小，不能直接相减
            if (obj1 > obj2) {
                return -1;
            } else if (obj1 < obj2) {
                return 1;
            } else {
                return 0;
            }
        })
    }
}


function createMonthButton(month) {
    let monthDiv = document.getElementById("div_month");

    let div = document.createElement("div");
    div.style.marginTop = "10px";
    let button = document.createElement("button");
    button.innerHTML = month;
    button.className = "normal-button";
    button.id = month;
    button.onclick = monthButtonClick;
    div.appendChild(button);
    monthDiv.appendChild(div);
}

function monthButtonClick() {
    handleContent(this.id);
}

function handleContent(month) {

    for (let i = 0; i < allMonthAry.length; i++) {
        let oneMonth = allMonthAry[i];
        let button = document.getElementById(oneMonth);
        if (oneMonth === month) {
            button.className = "selected-button";
        } else {
            button.className = "normal-button";
        }
    }


    let content = document.getElementById("div_content");
    content.innerHTML = "";

    let monthData = allData[month];

    let allExtendClassAry = monthData["allExtendClassAry"];
    let allDeadSleepAry = monthData["allDeadSleepAry"];
    let allAuditionAry = monthData["allAuditionAry"];

    // div_content
    let template = document.querySelector('#div_content_template').content;

    let extendClassTable = template.getElementById('extendClassTable');
    extendClassTable.innerHTML = "";
    for(let i = 0;i < allExtendClassAry.length; i++){
        let trow = getExtendClassDataRow(allExtendClassAry[i], i); //定义一个方法,返回tr数据
        extendClassTable.appendChild(trow);
    }

    let deadSleepTable = template.getElementById('deadSleepTable');
    deadSleepTable.innerHTML = "";
    for(let i = 0;i < allDeadSleepAry.length; i++){
        let trow = getDeadSleepDataRow(allDeadSleepAry[i], i); //定义一个方法,返回tr数据
        deadSleepTable.appendChild(trow);
    }

    let auditionTable = template.getElementById('auditionTable');
    auditionTable.innerHTML = "";
    for(let i = 0;i < allAuditionAry.length; i++){
        let trow = getAuditionDataRow(allAuditionAry[i], i); //定义一个方法,返回tr数据
        auditionTable.appendChild(trow);

        let rowColor = "";
        if(i % 2 === 0){
            rowColor = "#FFFFFF";
        }else{
            rowColor = "#FFF0AC";
        }

        let detailDataAry = allAuditionAry[i]["data"];
        if (detailDataAry.length > 1) {
            for (let j = 0; j < detailDataAry.length; j++) {
                let subRow = getAuditionDetailRow(detailDataAry[j], rowColor);
                auditionTable.appendChild(subRow);
            }
        }
    }


    let item = template.cloneNode(true);
    content.appendChild(item);
}


function getExtendClassDataRow(dic, index){
    let row = document.createElement('tr'); //创建行

    let indexCell = document.createElement('td'); //创建第一列id
    indexCell.innerHTML = index + 1; //填充数据
    row.appendChild(indexCell); //加入行  ，下面类似

    let nameCell = document.createElement('td');//创建第二列name
    nameCell.innerHTML = dic.name;
    row.appendChild(nameCell);

    let idCell = document.createElement('td');//创建第三列job
    row.appendChild(idCell);
    //
    // if (isTouchGo) {
    //     let idA = document.createElement('a');//创建第三列job
    //     idA.innerHTML = dic.ID;
    //     idA.href = getCustomerUrlByStudentId(dic.ID);
    //     idA.target = "_blank";
    //     idCell.appendChild(idA);
    // } else {
    //     idCell.innerHTML = dic.ID;
    // }
    idCell.innerHTML = dic.ID;


    let subjectCell = document.createElement('td');//创建第三列job
    subjectCell.innerHTML = dic.subject;
    row.appendChild(subjectCell);

    let timeCell = document.createElement('td');//创建第三列job
    timeCell.innerHTML = dic.time;
    row.appendChild(timeCell);

    return row; //返回tr数据
}

function getDeadSleepDataRow(dic, index){
    let row = document.createElement('tr'); //创建行

    let indexCell = document.createElement('td'); //创建第一列id
    indexCell.innerHTML = index + 1; //填充数据
    row.appendChild(indexCell); //加入行  ，下面类似

    let nameCell = document.createElement('td');//创建第二列name
    nameCell.innerHTML = dic.name;
    row.appendChild(nameCell);

    let idCell = document.createElement('td');//创建第三列job
    row.appendChild(idCell);

    // if (isTouchGo) {
    //     let idA = document.createElement('a');//创建第三列job
    //     idA.innerHTML = dic.ID;
    //     idA.href = getCustomerUrlByStudentId(dic.ID);
    //     idA.target = "_blank";
    //     idCell.appendChild(idA);
    // } else {
    //     idCell.innerHTML = dic.ID;
    // }
    idCell.innerHTML = dic.ID;


    let lastTimeCell = document.createElement('td');//创建第三列job
    lastTimeCell.innerHTML = dic.lastTime;
    row.appendChild(lastTimeCell);

    let newTimeCell = document.createElement('td');//创建第三列job
    newTimeCell.innerHTML = dic.newTime;
    row.appendChild(newTimeCell);

    return row; //返回tr数据
}

function getAuditionDataRow(dic, index){
    let row = document.createElement('tr'); //创建行

    if(index % 2 === 0){
        row.style.backgroundColor = "#FFFFFF";
    }else{
        row.style.backgroundColor = "#FFF0AC";
    }

    let rowSpan = dic["data"].length + 1;

    if (rowSpan === 2) {
        rowSpan = "1";
    }

    let indexCell = document.createElement('td'); //创建第一列id
    indexCell.innerHTML = index + 1; //填充数据
    indexCell.rowSpan = rowSpan;
    row.appendChild(indexCell); //加入行  ，下面类似

    let nameCell = document.createElement('td');//创建第二列name
    nameCell.innerHTML = dic.name;
    nameCell.rowSpan = rowSpan;
    row.appendChild(nameCell);

    let idCell = document.createElement('td');//创建第三列job
    idCell.rowSpan = rowSpan;
    row.appendChild(idCell);

    // if (isTouchGo) {
    //     let idA = document.createElement('a');//创建第三列job
    //     idA.innerHTML = dic.ID;
    //     idA.href = getCustomerUrlByStudentId(dic.ID);
    //     idA.target = "_blank";
    //     idCell.appendChild(idA);
    // } else {
    //     idCell.innerHTML =isTouchGo  dic.ID;
    // }

    idCell.innerHTML = dic.ID;

    let timeCell = document.createElement('td');//创建第三列job
    timeCell.innerHTML = dic.firstDate + "-" + dic.endDate;
    timeCell.rowSpan = rowSpan;
    row.appendChild(timeCell);

    if (parseInt(rowSpan) === 1) {

        let detailDic = dic["data"][0];

        let subjectCell = document.createElement('td');
        subjectCell.innerHTML = detailDic.subject;
        subjectCell.rowSpan = rowSpan;
        row.appendChild(subjectCell);

        let detailTimeCell = document.createElement('td');
        detailTimeCell.innerHTML = detailDic.time;
        detailTimeCell.rowSpan = rowSpan;
        row.appendChild(detailTimeCell);
    }

    return row;
}


function getAuditionDetailRow(dic, rowColor){

    let row = document.createElement('tr');

    row.style.backgroundColor = rowColor;

    let subjectCell = document.createElement('td');
    subjectCell.innerHTML = dic.subject;
    row.appendChild(subjectCell);

    let timeCell = document.createElement('td');
    timeCell.innerHTML = dic.time;
    row.appendChild(timeCell);

    return row;
}



//.html()用为读取和修改元素的HTML标签
// $("#first-date").html(today);
// $("#sec-date").html(today);

