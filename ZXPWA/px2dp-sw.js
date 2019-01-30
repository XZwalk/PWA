//首先定义需要缓存的路径, 以及需要缓存的静态文件的列表, 这个列表也可以通过 Webpack 插件生成。

var cacheName = 'px-to-dp-v1.21';
var filesToCache = [
  '/offline.html',
  '/scripts/px2dp.js',
  '/styles/px2dp.css',
  '/images/ic_about_white.svg',
  '/images/ic_back_white.svg',
  '/images/ic_compute_white.svg'
  '/images/offline.jpg',
  '/images/woodwall.jpg',
  '/images/woodwall2.jpg'
];



//self: 表示 Service Worker 作用域, 也是全局变量
// caches: 表示缓存
// skipWaiting: 表示强制当前处在 waiting 状态的脚本进入 activate 状态
// clients: 表示 Service Worker 接管的页面


//在注册完成安装 Service Worker 时, 抓取资源写入缓存


//当监听到install事件以后，去缓存池打开名为 oslab-kymjs-blog 的缓存仓库。
// 每个 service worker 会对应一个缓存池，每个缓存池有多个缓存仓库。
// 只要缓存被打开，就调用 cache.addAll() 并传入一个 url 列表，然后加载这些资源并将响应添加至缓存。
// 有个注意事项要知道 cache.addAll() 方法中，如果某个文件下载失败了，
// 那么整个缓存就会失败，service worker 的install事件也将会失败。
// 而如果install失败了，那么接下来 service worker 就完全不会工作了。
// 所以一定要注意，文件列表一定不要太长了，越长造成失败的可能性就越高，每个要缓存的页面越大失败的可能性也越高。
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});


//缓存的资源随着版本的更新会过期, 所以会根据缓存的字符串名称(这里变量为 cacheStorageKey,
// 值用了 "minimal-pwa-1")清除旧缓存,
// 可以遍历所有的缓存名称逐一判断决决定是否清除(备注: 简化的写法, Promise.all 中 return undefined 可能出错, 见评论)

//如果执行到了 activate，首先判断现在缓存池中的缓存仓库 cacheName 是否和我们声明的 cacheName 同一个，
// 如果不是，就清空缓存池中的无用缓存(install中下载新的缓存，activate 中删除旧缓存)。
// 所以建议大家在 cacheName 的末尾加一个版本号，这样可以始终让service worker 加载最新的缓存。
self.addEventListener('activate', function(e) {  
  e.waitUntil(  
    caches.keys().then(function(keyList) {  
      return Promise.all(keyList.map(function(key) {   
        if (key !== cacheName) {  
          return caches.delete(key);  
        }  
      }));  
    })  
  );  
});


//网页抓取资源的过程中, 在 Service Worker 可以捕获到 fetch 事件, 可以编写代码决定如何响应资源的请求
self.addEventListener('fetch', function(e) {
  var extendDataUrl = [
  ];

  var allDataUrl = extendDataUrl;
  var requestIsDataApi = false;

  //如果是 API 请求，先网络后缓存
  for (count in extendDataUrl){
    if (e.request.url.indexOf(extendDataUrl[count]) > -1 ) {
      requestIsDataApi = true;
      e.respondWith(
        fetch(e.request)
        .then(function(response) {
          return caches.open(cacheName).then(function(cache){
            cache.put(e.request.url, response.clone()); 
            return response;
          });
        })
        .catch(function(){
          return caches.match(e.request.url);
        })
      );
      break;
    }
  }

  //一般资源请求，先缓存再网络再默认
  if (!requestIsDataApi){
    e.respondWith(
      caches.match(e.request).then(function(respond){
        return respond || fetch(e.request)
          .then(function(res){
            return caches.open(cacheName).then(function(cache){
              cache.put(e.request.url, res.clone()); 
              return res;
            });
          })
          .catch(function(){
            return caches.match('offline.html');
          });
      })
    )
  }

});

