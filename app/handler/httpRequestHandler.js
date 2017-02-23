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

          function set_metadata (dataType, data) {
              //
              console.log(dataType);
              console.log(data);
          };

          $.ajax({
              method: "GET",
              headers: module.headers,
              dataType: "jsonp",
              url: url,
              jsonpCallback: 'set_metadata',
              success: function (data) {
                  console.log('successfully here');
                  rtn.code = 200;
                  rtn.response = data;
                  resolve(rtn);
              },
              error: function (error) {
                  console.log('error here');
                  rtn.code = 400;
                  rtn.response = error;
                  reject(rtn);
              }
          });
      });
    }

    return module;
}
