/**
 * /src/js/index/enter.js -> index.html
 */

//适配手机屏幕布局的
import 'ijijin_builder/stylebuild/lib/mobile.less';

import '../../main.css';

//安装之后这边还要引入
import CryptoJS from 'crypto-js/crypto-js';

import { handleBusinessLoanTotalResponse } from "../data/business-loan-total";
import { handleBusinessRepaymentPlanResponse } from "../data/business-repayment-plan";

import { handleFundLoanTotalResponse } from "../data/fund-loan-total";
import { handleFundRepaymentPlanResponse } from "../data/fund-repayment-plan";

import { handleCarLoanTotalResponse } from "../data/car-loan-total";
import { handleCarRepaymentPlanResponse } from "../data/car-repayment-plan";


//因为webpack打包的时候不会去处理内嵌到html中的js代码，如果是低版本的系统（安卓4.4）会出现一些语法不支持的问题，比如let，() => {}等问题
//webpack则会处理兼容这些问题


// 取回
$("#secretKey").val(localStorage.getItem("myLoanSecretKey"));

document.getElementById("changeKey").onclick = function () {
    if (typeof(Storage) !== "undefined") {
        // 存储
        localStorage.setItem("myLoanSecretKey", $("#secretKey").val());
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
    navigator.serviceWorker.register('/PWA/LoanPWA/sw.js')
        .then(function (registration) {
            console.log('Registered events at scope: ', registration.scope);
        });
}


// 解密
// https://moln.site/2018/06/22/crypto-js-aes-usage.html
// http://tool.chacuo.net/cryptaes
// http://www.fly63.com/article/detial/426
//对原始数据进行加密操作的时候配置参照assets/image/aes加密操作.png
let secretKey = document.getElementById("secretKey").value;

if (secretKey.length !== 16) {
    secretKey = "";
}

function decryptedData(aesData) {

    if (!aesData || aesData.length === 0) {
        return "";
    }

    if (!secretKey || secretKey.length === 0) {
        return "";
    }

    let key = CryptoJS.enc.Utf8.parse(secretKey);

    let decryptedData = CryptoJS.AES.decrypt(aesData, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
    });

    try {
        //防止报错，不是规则的utf8
        let decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData).toString();
        return decryptedStr;
    }catch (e) {
        return "";
    }
}


//表格
function altRows(id){
    if(document.getElementsByTagName){

        var table = document.getElementById(id);
        var rows = table.getElementsByTagName("tr");

        for(let i = 0; i < rows.length; i++){
            if(i % 2 == 0){
                rows[i].className = "even-row-color";
            }else{
                rows[i].className = "odd-row-color";
            }
        }
    }
}

window.onload=function(){
    //表格隔行展示UI
    altRows('bus-total-div-table');
    altRows('fund-total-div-table');
    altRows('car-total-div-table');
};


//本月计划
let businessBJ = "";
let businessLX = "";
let businessDate = "";
let fundBJ = "";
let fundLX = "";
let fundDate = "";
let carBJ = "";
let carLX = "";
let carDate = "";

setTimeout(() => {

    if (businessBJ.length === 0) {
        $("#now-total-div").css({"display":"none"});
        return;
    }

    //等下面的数据都处理好了，再处理
    $("#now-bus-principal").html(businessBJ);
    $("#now-bus-interest").html(businessLX);
    $("#now-bus-date").html(businessDate);
    $("#now-bus-total").html((parseFloat(businessBJ) + parseFloat(businessLX)).toFixed(2));

    $("#now-fund-principal").html(fundBJ);
    $("#now-fund-interest").html(fundLX);
    $("#now-fund-date").html(fundDate);
    $("#now-fund-total").html((parseFloat(fundBJ) + parseFloat(fundLX)).toFixed(2));

    $("#now-car-principal").html(carBJ);
    $("#now-car-interest").html(carLX);
    $("#now-car-date").html(carDate);
    $("#now-car-total").html((parseFloat(carBJ) + parseFloat(carLX)).toFixed(2));

    $("#now-total").html((parseFloat(businessBJ) + parseFloat(businessLX) + parseFloat(fundBJ) + parseFloat(fundLX) + parseFloat(carBJ) + parseFloat(carLX)).toFixed(2));

}, 100);


//商贷总览
handleBusinessLoanTotalResponse((data) => {
    data = decryptedData(data);

    if (!data || data.length === 0) {
        //隐藏
        $("#bus-total-div").css({"display":"none"});
        return;
    }

    //去字符串后面的特殊字符
    data = data.replace(/\u0000/g, "");
    let jsonData = JSON.parse(data);

    $("#bus-total-bank").html("中国农业银行股份有限公司杭州解放路支行");
    $("#bus-total-rate").html("5.635%");
    $("#bus-total-fine-rate").html("8.4525%");
    $("#bus-total-pay-style").html("等额本息");
    $("#bus-total-principal").html("52万");
    $("#bus-total-interest").html("55.88万");
    $("#bus-total-firstDate").html(jsonData[0].sLonDat);
    $("#bus-total-endDate").html(jsonData[0].sExpDat);
});

//商贷还款计划
handleBusinessRepaymentPlanResponse((data) => {
    data = changEncryptionDataToJson(data);
    if (!data || data.length === 0) {
        $("#bus-total-balance").html("52万");
        $("#bus-total-balance-already").html("0.00");
        $("#bus-total-interest-already").html("0.00");
        $("#bus-total-interest-balance").html("55.88万");
        return;
    }

    let today = getTodayDate(1);
    // let today = "20190302";
    let alreadyPayInterest = 0;
    let lastDbal = "";
    for (let i = 0; i < data.length; i++) {
        //{
        // 		"nIPrd": "1",
        // 		"sDueDat": "20190301",
        // 		"dPerAmt": "2996.70",
        // 		"dAmt": "554.87",
        // 		"dInt": "2441.83",
        // 		"dBal": "519445.13"
        // 	}
        let item = data[i];

        $("#bus-total-pay-date").html("每月" + item.sDueDat.substring(6, 8) + "号");

        businessBJ = item.dAmt;
        businessLX = item.dInt;
        businessDate = "每月" + item.sDueDat.substring(6, 8) + "号";

        if (i == 0) {
            //第一个日期
            if (today < item.sDueDat) {
                //还未开始还款
                $("#bus-total-balance").html("52万");
                $("#bus-total-balance-already").html("0.00");
                $("#bus-total-interest-already").html("0.00");
                $("#bus-total-interest-balance").html("55.88万");
                return;
            }
        } else {
            //开始还款
            if (today < item.sDueDat) {
                $("#bus-total-balance").html(parseFloat(lastDbal));
                $("#bus-total-balance-already").html((52 * 10000 - parseFloat(lastDbal)).toFixed(2));
                $("#bus-total-interest-balance").html(55.88 * 10000 - alreadyPayInterest);
                $("#bus-total-interest-already").html(alreadyPayInterest);
                return;
            }
        }

        alreadyPayInterest += parseFloat(item.dInt);
        lastDbal = item.dBal;
    }
});


//公积金贷款总览
handleFundLoanTotalResponse((data) => {
    data = decryptedData(data);

    if (!data || data.length === 0) {
        //隐藏
        $("#fund-total-div").css({"display":"none"});
        return;
    }

    //去字符串后面的特殊字符
    data = data.replace(/\u0000/g, "");
    let jsonData = JSON.parse(data);

    $("#fund-total-bank").html(jsonData.loanBank);
    $("#fund-total-rate").html(parseFloat(jsonData.loanRate) * 100 + "%");
    $("#fund-total-fine-rate").html(parseFloat(jsonData.punishRate) * 100 + "%");
    $("#fund-total-pay-style").html("等额本息");
    $("#fund-total-principal").html(parseFloat(jsonData.loanAmount) / 10000 + "万");
    $("#fund-total-interest").html("36.84万");
    $("#fund-total-firstDate").html(jsonData.loanBeginDate);
    $("#fund-total-endDate").html(jsonData.loanEndDate);
});

handleFundRepaymentPlanResponse((data) => {
    data = changEncryptionDataToJson(data);
    if (!data || data.length === 0) {
        $("#fund-total-balance").html("65万");
        $("#fund-total-balance-already").html("0.00");
        $("#fund-total-interest-already").html("0.00");
        $("#fund-total-interest-balance").html("36.84万");
        return;
    }

    let today = getTodayDate(1);
    // let today = "20190301";
    let alreadyPayInterest = 0;
    let alreadyPayAmount = 0;

    data = data.loanPlanList;

    for (let i = 0; i < data.length; i++) {
        //{
        // 		"refundDate": "20190320",
        // 		"defaultAmount": "1068.42",
        // 		"baseInterest": "2757.99",
        // 		"defaultInterest": "0.00",
        // 		"refundTotal": "3826.41"
        // 	}
        let item = data[i];

        $("#fund-total-pay-date").html("每月" + item.refundDate.substring(6, 8) + "号");

        fundBJ = item.defaultAmount;
        fundLX = item.baseInterest;
        fundDate = "每月" + item.refundDate.substring(6, 8) + "号";

        if (i == 0) {
            //第一个日期
            if (today < item.refundDate) {
                //还未开始还款
                $("#fund-total-balance").html("65万");
                $("#fund-total-balance-already").html("0.00");
                $("#fund-total-interest-already").html("0.00");
                $("#fund-total-interest-balance").html("36.84万");
                return;
            }
        } else {
            //开始还款
            if (today < item.refundDate) {
                $("#fund-total-balance").html((65 * 10000 - alreadyPayAmount).toFixed(2));
                $("#fund-total-balance-already").html(alreadyPayAmount);

                $("#fund-total-interest-balance").html(55.88 * 10000 - alreadyPayInterest);
                $("#fund-total-interest-already").html(alreadyPayInterest);
                return;
            }
        }

        alreadyPayInterest += parseFloat(item.baseInterest);
        alreadyPayAmount += parseFloat(item.defaultAmount);
    }
});

//车位贷总览
handleCarLoanTotalResponse((data) => {
    data = decryptedData(data);

    if (!data || data.length === 0) {
        //隐藏
        $("#car-total-div").css({"display":"none"});
        return;
    }

    //去字符串后面的特殊字符
    data = data.replace(/\u0000/g, "");
    let jsonData = JSON.parse(data).INFBDY.WCLNQLN1Z1[0];
    $("#car-total-bank").html("中国招商银行股份有限公司杭州深蓝支行");
    $("#car-total-rate").html(parseFloat(jsonData.RATEXE) * 1 + "%");
    $("#car-total-fine-rate").html("暂无");
    $("#car-total-pay-style").html("等额本息");
    $("#car-total-principal").html(parseFloat(jsonData.USDAMT) / 10000 + "万");
    $("#car-total-balance").html(jsonData.CPTSUM);
    $("#car-total-firstDate").html(jsonData.BILUPD);
    $("#car-total-endDate").html(jsonData.ENDDTE);
});

handleCarRepaymentPlanResponse((data) => {
    data = changEncryptionDataToJson(data);
    if (!data || data.length === 0) {
        $("#car-total-balance").html("16万");
        $("#car-total-balance-already").html("0.00");
        $("#car-total-interest-already").html("0.00");
        $("#car-total-interest-balance").html("0.00");
        return;
    }

    let today = getTodayDate(1);
    let alreadyPayInterest = 0;
    let alreadyPayAmount = 0;

    data = data.INFBDY.WCPAYPLNZ1;

    //获取总利息
    let totalInterest = 0;
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        totalInterest += parseFloat(item.INTAMT);
    }
    $("#car-total-interest").html(totalInterest.toFixed(2));

    for (let i = 0; i < data.length; i++) {
        //{
        // 			"DAYDAY": "28",
        // 			"LONNBR": "8180927765006",
        // 			"SEQSEQ": "5",
        // 			"RCDSTS": "",
        // 			"TMSFLG": "Y",
        // 			"PAYSUM": "3183.31",
        // 			"CRTTIM": "145211",
        // 			"CRTDTE": "20181024",
        // 			"BPLSEQ": "1",
        // 			"BALAMT": "148749.25",
        // 			"EXERAT": "7.2000000",
        // 			"TMSTMS": "5",
        // 			"INTALW": "0.00",
        // 			"CPTAMT": "2277.15",
        // 			"INTAMT": "906.16",
        // 			"PAYDTE": "20190319"
        // 		}
        let item = data[i];

        $("#car-total-pay-date").html("每月" + item.PAYDTE.substring(6, 8) + "号");

        carBJ = item.CPTAMT;
        carLX = item.INTAMT;
        carDate = "每月" + item.PAYDTE.substring(6, 8) + "号";

        if (i == 0) {
            //第一个日期
            if (today < item.PAYDTE) {
                //还未开始还款
                $("#car-total-balance").html("16万");
                $("#car-total-balance-already").html("0.00");
                $("#car-total-interest-already").html("0.00");
                $("#car-total-interest-balance").html(totalInterest);
                return;
            }
        } else {
            //开始还款
            if (today < item.PAYDTE) {
                $("#car-total-balance").html((16 * 10000 - alreadyPayAmount).toFixed(2));
                $("#car-total-balance-already").html(alreadyPayAmount.toFixed(2));

                $("#car-total-interest-balance").html((totalInterest - alreadyPayInterest).toFixed(2));
                $("#car-total-interest-already").html(alreadyPayInterest.toFixed(2));
                return;
            }
        }

        alreadyPayInterest += parseFloat(item.INTAMT);
        alreadyPayAmount += parseFloat(item.CPTAMT);
    }
});




/********************************************************************************************************
 * 公共方法
 */

//将加密的数据转为json
function changEncryptionDataToJson(data) {
    data = decryptedData(data);

    if (!data || data.length === 0) {
        return "";
    }

    //去字符串后面的特殊字符
    data = data.replace(/\u0000/g, "");
    let jsonData = JSON.parse(data);
    return jsonData;
}


//获取当前的日期
function getTodayDate(format) {
    let now = new Date();

    let year = now.getFullYear(); //得到年份
    let month = now.getMonth();//得到月份
    let date = now.getDate();//得到日期
    let day = now.getDay();//得到周几
    let hour = now.getHours();//得到小时
    let minute = now.getMinutes();//得到分钟
    let sec = now.getSeconds();//得到秒
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (sec < 10) sec = "0" + sec;
    let time = "";
    //精确到天
    if(format == 1){
        time = year + month + date;
    }
    //精确到分
    else if(format == 2){
        time = year + "-" + month + "-" + date+ " " + hour + ":" + minute + ":" + sec;
    }
    return time;
}


//.html()用为读取和修改元素的HTML标签
// $("#first-date").html(today);
// $("#sec-date").html(today);





//唤醒
// $('#shareTouchDiv').on('click', function () {
//     //分享唤醒对象
//     var wake = _.awake(window.location.href);
//     //唤醒事件
//     wake.clickAwake();
// });
