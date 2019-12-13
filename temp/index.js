

let urlPrefix = '';
let urlSuffix = '';
if (window.location.href.indexOf('http://zxwalk.coding.me') !== -1) {
    urlPrefix = 'http://zxwalk.coding.me/mingming/html';
    urlSuffix = '?time=' + (new Date()).getTime();
}

let downloadData = null;
readJsonData(urlPrefix + "./download.json" + urlSuffix, (downloadInfo) => {
    readJsonData(urlPrefix + "./videoInfo.json" + urlSuffix, (videoInfo) => {
        handleData(downloadInfo, videoInfo);
    });
});

function handleData(downloadInfo, videoInfo) {

    let buttonDiv = document.getElementById('buttonDiv');
    buttonDiv.innerHTML = '';

    for (let key in downloadInfo) {
        let oneDownload = downloadInfo[key];
        let videoJson = null;
        for (let tempKey in videoInfo) {
            let tempItem = videoInfo[tempKey];
            if (tempKey === key) {
                videoJson = tempItem;
                break;
            }
        }

        for (let i = 0; i < oneDownload.length; i++) {
            let oneItem = oneDownload[i];
            let dataAry = videoJson['data'];
            for (let j = 0; j < dataAry.length; j++) {
                let tempItem = dataAry[j];
                if (tempItem['id'] === oneItem['id']) {
                    oneItem['image'] = tempItem['image'];
                    break;
                }
            }
        }

        let button = document.createElement('button');
        button.innerHTML = videoJson['name'];
        button.id = key;
        button.onclick = buttonClick;
        buttonDiv.appendChild(button);
    }

    downloadData = downloadInfo;
    console.log('');
}

function buttonClick() {
    let oneAry = downloadData[this.id];

    let contentDiv = document.getElementById('contentDiv');
    contentDiv.innerHTML = '';
    for (let i = 0; i < oneAry.length; i++) {
        let oneItem = oneAry[i];
        let div = document.createElement('div');
        contentDiv.appendChild(div);
        div.style.width = '100%';
        div.style.padding = '30px';

        let title = document.createElement('p');
        div.appendChild(title);
        title.innerHTML = oneItem['name'];

        let image = document.createElement('img');
        div.appendChild(image);
        image.src = oneItem['image'];

        let link = document.createElement('p');
        div.appendChild(link);
        link.innerHTML = oneItem['downloadUrl'];
    }
}



function readJsonData(url, completeBlock) {
    /*json文件url，本地的就写本地的位置，如果是服务器的就写服务器的路径*/
    let request = new XMLHttpRequest();
    request.open("get", url);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            let json = JSON.parse(request.responseText);
            completeBlock(json);
        }
    }
}
