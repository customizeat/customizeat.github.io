function RequestHandler(httpRequestHandler, cacheRequestHandler) {
    var module = {};
    module.httpRequestHandler = httpRequestHandler;
    module.cacheRequestHandler = cacheRequestHandler;

    module.get = function (url, headers={}, dataType='json') {
        return new Promise(function(resolve, reject) {
            var rtn = {
                'response': '',
                'code': 400 // Bad request by default
            };

            if (url.length === 0) {
                rtn.response = 'url must be provided';
                rtn.code = 400;
                reject(rtn);
            }

            // fetch values from the cache first. if cache data available, use it.
            var cacheValue = module.cacheRequestHandler.get(url);
            if (cacheValue && Object.keys(cacheValue).length) {
                console.log('fetching data from cache');
                rtn.response = cacheValue;
                rtn.code = 200;
                resolve(rtn);
            } else {
                console.log('fetching data from API');
                if (Object.keys(headers).length > 0) {
                    module.httpRequestHandler.setHeaders(headers);
                }

                var response;
                if (dataType === 'jsonp') {
                  response = module.httpRequestHandler.getJSONP(url);
                } else {
                  response = module.httpRequestHandler.get(url);
                }
                response.then(function(data) {
                  var responseText = data.response;
                  var responseCode = data.code;
                  module.cacheRequestHandler.set(url, responseText);

                  rtn.response = data.response;
                  rtn.code = data.code;
                  resolve(rtn);
                }, function(err) {
                  rtn.response = err.response;
                  rtn.code;
                });
            }
        });
    };

    return module;
}
