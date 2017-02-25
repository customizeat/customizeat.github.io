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

    module.jsonpResult = null;

    module.get = function (url) {
        return new Promise (function(resolve, reject) {
            var rtn = {
                'response': '',
                'code': 400
            };

            $.ajax({
                method: "GET",
                headers: module.headers,
                dataType: "json",
                url: url,
                success: function (data) {
                    rtn.code = 200;
                    rtn.response = data;
                    resolve(rtn);
                },
                error: function (error) {
                    rtn.code = 400;
                    rtn.response = error;
                    reject(rtn);
                }
            });
        });
    };

    module.getJSONP = function (url) {
      return new Promise (function(resolve, reject) {
          var rtn = {
              'response': '',
              'code': 400
          };

          $.ajax({
              method: "GET",
              headers: module.headers,
              dataType: "jsonp",
              url: url,
              jsonp: 'callback',
              complete: function (response) {
                  if (response.status === 200 && module.jsonpResult) {
                    rtn.code = 200;
                    // copy a new instance of the object
                    rtn.response = Object.assign({}, module.jsonpResult.data);
                    // null out the jsonpResult for next call.
                    module.jsonpResult = null;
                    resolve(rtn);
                  } else {
                    rtn.code = response.status;
                    rtn.response = response.statusText;
                    reject(rtn);
                  }
              }
          });
      });
    }

    return module;
}
