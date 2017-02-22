function HttpRequestHandler() {
    var module = {};
    module.headers = {
      'content-type': 'application/json',
      'X-Yummly-App-ID': '9cce27e7',
      'X-Yummly-App-Key': 'b13c741344519e5f89cb0edb7e8043f6'
    };

    module.setHeaders = function (headers) {
        module.headers = headers;
    };

    module.get = function (url) {
        return new Promise (function(resolve, reject) {
            var rtn = {
                'response': '',
                'code': 400
            };

            var request = $.ajax({
                method: "GET",
                headers: module.headers,
                dataType: "json",
                url: url,
                success: function (data) {
                    rtn.code = 200;
                    rtn.response = data;
                    resolve(rtn);
                },
                fail: function (error) {
                    rtn.code = 400;
                    rtn.response = error;
                    reject(rtn);
                }
            });
        });
    };

    return module;
}
