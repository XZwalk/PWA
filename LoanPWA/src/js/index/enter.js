/**
 * /src/js/index/enter.js -> index.html
 */

//适配手机屏幕布局的
import 'ijijin_builder/stylebuild/lib/mobile.less';

import '../../main.css';

//安装之后这边还要引入
import CryptoJS from 'crypto-js/crypto-js';

import { handleBusinessLoanTotalResponse } from "../data/business-loan-total";


//因为webpack打包的时候不会去处理内嵌到html中的js代码，如果是低版本的系统（安卓4.4）会出现一些语法不支持的问题，比如let，() => {}等问题
//webpack则会处理兼容这些问题


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
