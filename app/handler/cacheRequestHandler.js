function CacheRequestHandler() {
    var module = {};
    module.get = function (url) {
        var cacheValue = localStorage.getItem("cache::" + url);
        cacheValue = cacheValue !== undefined ? JSON.parse(cacheValue) : null;

        if (!cacheValue || !cacheValue.timestamp) {
            return null;
        }

        var currentTime = Date.now();
        var timestamp = cacheValue.timestamp;
        var dataToRtn = cacheValue.data;
        var oneDay = 8640000;

        /* If access date is over one day, need to update from API */
        if (currentTime - timestamp >= oneDay) {
          dataToRtn = null;
        }

        return dataToRtn;
    }

    module.set = function (url, responseText) {
        var timeStamp = Date.now();
        var datatoWrite = {
          timestamp: timeStamp,
          data: cacheValue
        };

        localStorage.setItem("cache::" + url, JSON.stringify(datatoWrite));
    }

    return module;
}
