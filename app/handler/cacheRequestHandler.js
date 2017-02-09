function CacheRequestHandler() {
    var module = {};
    module.get = function (url) {
        var cacheValue = localStorage.getItem("cache::" + url);
        cacheValue = cacheValue !== undefined ? JSON.parse(cacheValue) : null;
        return cacheValue;
    }

    module.set = function (url, responseText) {
        var cacheValue = responseText;
        if (typeof cacheValue !== 'string') {
            cacheValue = JSON.stringify(responseText);
        }
        localStorage.setItem("cache::" + url, cacheValue);
    }

    return module;
}
