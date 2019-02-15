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
    altRows('bus-total-div-table');
    altRows('fund-total-div-table');
    altRows('car-total-div-table');
};



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
    $("#bus-total-principal").html(jsonData[0].dLonAmt);
    $("#bus-total-balance").html(jsonData[0].dCurBal);
    $("#bus-total-firstDate").html(jsonData[0].sLonDat);
    $("#bus-total-endDate").html(jsonData[0].sExpDat);
});

handleBusinessRepaymentPlanResponse(() => {

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
    $("#fund-total-principal").html(jsonData.loanAmount);
    $("#fund-total-balance").html(jsonData.remainAmount);
    $("#fund-total-firstDate").html(jsonData.loanBeginDate);
    $("#fund-total-endDate").html(jsonData.loanEndDate);
});

handleFundRepaymentPlanResponse(() => {

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
    $("#car-total-principal").html(jsonData.USDAMT);
    $("#car-total-balance").html(jsonData.CPTSUM);
    $("#car-total-firstDate").html(jsonData.BILUPD);
    $("#car-total-endDate").html(jsonData.ENDDTE);
});

handleCarRepaymentPlanResponse(() => {

});


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
