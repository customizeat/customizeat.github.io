function HttpRequestHandler() {
    var module = {};
    module.headers = { 'content-type': 'application/json' };

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
