
//参考：https://www.jianshu.com/p/990df3a9e012

const tinify = require("tinify");

//一个月只能使用500次
tinify.key = "CmnmCSfhxcgK9cRwZmwSk4yfmTVp026S"; // 自行注册

let source = tinify.fromFile("large.png");

let sizeAry = ["256", "192", "152", "144", "128", "32"];

createAllSizes(sizeAry);

function createAllSizes(sizeAry) {
    if (!sizeAry) return;

    for (let i = 0; i < sizeAry.length; i++) {
        let size = sizeAry[i];

        let reSized = source.resize({
            method: "fit",
            width: parseInt(size),
            height: parseInt(size)
        });

        //icon-144x144.png
        reSized.toFile("icon-" + size + "x" + size + ".png");
    }
}



