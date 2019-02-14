/**
 * /src/js/index/enter.js -> index.html
 */

import 'ijijin_builder/stylebuild/lib/mobile.less';

import '../../style.css'

//因为webpack打包的时候不会去处理内嵌到html中的js代码，如果是低版本的系统（安卓4.4）会出现一些语法不支持的问题，比如let，() => {}等问题
//webpack则会处理兼容这些问题

//发埋点
//getResources(['ijijinStat', 'ijijinProtocol', 'ijijinAwake', 'ijijinBanks']
//这种引用顺序会导致客户端点击分享异常弹窗
_.getResources(['ijijinStat', 'ijijinAwake', 'ijijinBanks', 'ijijinProtocol'], () => {
    //发送埋点
    _.statSet({
        pageid: 'fund_mkt_20190129_jqb',
        url_ver: 'FS-12704',
        bottom: true//是否发送滑动到底部的埋点
    });

    if (isNotInApp()) {
        // 分享唤醒对象
        var wake = _.awake(window.location.href);
        //这个就是调出“点击这里选择在Safari中打开的提示”
        wake.initAwake();   //直接唤醒

        $('#shareTouchDiv').show();
    } else {
        _.hdShare({
            flag: '1',
            title: '@你~春节赚红包，用时随时取，存入当日起息！',
            shareUrl: window.location.href,
            description: '银行存款，年化利率4.1%。'
        });

        $('#shareTouchDiv').hide();
    }
});


//设置头部图片
var _t = document.getElementById("topload"),
    _to = _t.getAttribute("data-original"),
    _tf = _t.getAttribute("data-format");

var dpr = window.devicePixelRatio;
dpr = dpr > 2 ? 2 : dpr;

var _img = new Image();
_img.onload = function () {
    _t.setAttribute('src', _img.src);
    _t.removeAttribute('data-original');
    _t.removeAttribute('data-format');
};
if (dpr < 2) {
    _img.src = _to + '_1x.' + _tf;
} else {
    _img.src = _to + '_2x.' + _tf;
}

//设置日期
let date = new Date();
let today = date.getDate();
if (today < 25) {
    today = 31;
}
//.html()用为读取和修改元素的HTML标签
$("#first-date").html(today);
$("#sec-date").html(today);


//发送请求
$(function () {

    window.onscroll = function () {
        var btn_top = $('#btn').offset().top,
            btn_height = $('#btn').offset().height;

        var scro_top = $(window).scrollTop();
        if (scro_top > btn_top - btn_height) {
            $('#fix').show();
        } else {
            $('#fix').hide();
        }
    };


    var jjcode = 'ZHCPRY000001';
    let bankType = "";
    //http://fund.10jqka.com.cn/interface/bankDeposit/detail/aib/ZHCPRY000001
    $.getJSON('/interface/bankDeposit/detail/aib/' + jjcode, function (data) {
        // $("#fund-sy").eq(e).html(parseFloat(data.data[e].basIntRate).toFixed(2) + "%");
        $("#fund-sy").html(parseFloat(data.data.basIntRate).toFixed(2) + "%");
        bankType = data.data.type ? data.data.type : "";
    });


    // if (_.log) {
    //     //发送埋点
    //     _.log({
    //         targid: 'remark_' + (obj.productid || 'null'),
    //         to_page: 'fund_bank_product_details_' + obj.productid
    //     }).clickStat('des.top.' + detailIndex);
    // }

    var bool = false;
    $('#win_open').on('click', function () {
        // ifund_hdtj.clickStat('des');
        _.log().clickStat('des');
        bool = true;
        $('#window').show().bind('touchmove', function (event) {
            if (event.target.type == 'range' && bool) return;
            event.preventDefault();
        });
        $('#win_close').on('click', function () {
            bool = false;
            // ifund_hdtj.clickStat('dialogdes.close');
            _.log().clickStat('dialogdes.close');
            $('#window').hide();
        })
    });

    $('.tobuy').on('click', function () {
        //获取属性的值,点击不同的按钮获取同一个属性，得到不同的埋点值
        var tjid_ths = $(this).attr("tjid_ths");
        // let targid = "jj_" + jjcode;
        //发送埋点
        _.log().jumpPageStat(tjid_ths, "fund_bank_trade_aib");

        var sdkid = 'fund_mkt_20190129_jqb.' + tjid_ths;
        _.bank('aibank', sdkid).buy(jjcode, bankType);
        return false;
    });

    $('#product-card').on('click', function () {

        //发送埋点
        _.log().jumpPageStat("detail", "fund_bank_product_details_" + jjcode);
        _.bank('aibank', 'fund_mkt_20190129_jqb.detail').detail(jjcode, bankType);
    });
});


function isNotInApp() {
    let inIjijin = _.platform.getIjijinVersion() !== '0';
    return !(inIjijin || _.platform.getThsVersion());
}


//唤醒
$('#shareTouchDiv').on('click', function () {
    //分享唤醒对象
    var wake = _.awake(window.location.href);
    //唤醒事件
    wake.clickAwake();
});
