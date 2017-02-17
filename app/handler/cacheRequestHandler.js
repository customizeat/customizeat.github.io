function CacheRequestHandler() {
    var module = {};
    module.get = function (url) {
        var cacheValue = localStorage.getItem("cache::" + url);
        cacheValue = cacheValue !== undefined ? JSON.parse(cacheValue) : null;

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
        var cacheValue = responseText;
        if (typeof cacheValue !== 'string') {
            cacheValue = JSON.stringify(responseText);
        }
        //localStorage.setItem("cache::" + url, cacheValue);
        var timeStamp = Date.now();
        var datetoWrite = {
          timestamp: timeStamp,
          data: cacheValue
        };

        localStorage.setItem("cache::" + url, JSON.stringify(datetoWrite));
    }

    return module;
}


/*
var dataFromAPI = {
recipeId: 'someID',
recipeSteps: blahblahblah
};

var timeStamp = Date.now();

var dateToWrite = {
timestamp: timeStamp, // 1359101230219830
data: dataFromAPI
};

setItem(data, timeStamp);

localStorage.setItem('cache::' + url, JSON.stringify(dataToWrite));

////// getting data now
var data = localStorage.getItem('cache::' + url);
data = (data.length) ? JSON.parse(data) : null;

var currentTime = Date.now();
var timestamp = data.timestamp;
var dataToRtn = data.data; // data['data']
if (currentTime - timestamp > 60 minutes) {
  dataToRtn = null;
}

return dataToRtn;

*/
