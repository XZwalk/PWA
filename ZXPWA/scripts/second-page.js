var secondTab = {};

secondTab.createItem = function (data) {
    var template = document.querySelector('#blogListTemplate').content;
    //set content
    var link = template.getElementById('blogLink');
    link.href = data.link;
    link.title = data.title;
    var time = template.getElementById('blogTime');
    time.innerHTML = data.pubDate.concat(' By 张涛');
    var title = template.getElementById('title');
    title.innerHTML = ': '.concat(data.title);
    var description = template.getElementById('description');
    description.innerHTML = data.description;
    var tag = template.getElementById('tag');
    switch (data.category) {
        case 'code':
            tag.innerHTML = "技术";
            tag.color = "#AE57A4";
            break;
        case 'stickies':
            tag.innerHTML = "随笔";
            tag.color = "#FF8000";
            break;
        case 'manager':
            tag.innerHTML = "管理";
            tag.color = "#0066CC";
            break;
        case 'english':
            tag.innerHTML = "英语";
            tag.color = "#BB3D00";
            break;
        case 'story':
            tag.innerHTML = "小说";
            tag.color = "#008080";
            break;
    }
    var item = template.cloneNode(true);
    return item;
};

secondTab.addBlogListContent = function (itemList) {
    while (window.app.container.childNodes[2]) {
        window.app.container.removeChild(window.app.container.childNodes[2]);
    }

    for (var i = 0; i < itemList.length; i++) {
        var item = secondTab.createItem(itemList[i]);
        window.app.container.appendChild(item);
    }
    ;
};

/*****************************************************************************
 *
 * Methods for dealing with the model
 *
 ****************************************************************************/

secondTab.requestBlogList = function () {
    var url = "/api/download.json";

    if ('caches' in window) {

        caches.match(url).then(function (response) {
            if (response) {
                response.json().then(function updateFromCache(json) {
                    var itemList = json.item;
                    secondTab.addBlogListContent(itemList);
                });
            }
        });
    }

    var xmlhttp = createXMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
            var response = JSON.parse(xmlhttp.response);
            var itemList = response.item;
            secondTab.addBlogListContent(itemList);
        }
    };
    xmlhttp.open("GET", url);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    xmlhttp.send();
};

function createXMLHttpRequest() {
    var xmlHttp;
    if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    return xmlHttp;
}