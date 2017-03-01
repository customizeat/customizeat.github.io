function APIInterface(reqHandler, userParams = {}) {
    // exposing it to consumer for proper use
    var module = {};

    // no need to expose to consumer
    var internals = {
      urls: {
        base: 'https://api.yummly.com/v1/api',
        searchRecipes: '/recipes', // recipes?q
        getRecipe: '/recipe/', // recipe/recipe-id?
        getMetadata: '/metadata/' // metadata/ingredient?
      },
      authParams: '?_app_id=9cce27e7&_app_key=b13c741344519e5f89cb0edb7e8043f6',
      metadataKeys: [
          'ingredient',
          'diet',
          'allergy',
          'cuisine',
          'course',
          'holiday',
      ],
      defaultParams: {
        requirePictures: 'true'
      },
      userParams: userParams
    };

    // returns query parameters [?q=onion+soup&requirePictures=true]
    // searchText is the text entered in the search bar,
    // params is key value of query parameter values
    module.buildQueryParams = function (searchText, requestParams={}) {
      var queryParams = '?';
      // &q=onion+soup
      // replace all instances of spaces with +
      searchText = searchText.replace(/\s+/g, "+");
      queryParams += 'q=' + searchText;

      var addParams = function (q, params) {
        for (var param in params) {
          if(params[param].length) {
            q += '&' + param + '=' + params[param];
          }
        }

        return q;
      }

      // Add this request's params
      queryParams = addParams(queryParams, requestParams);
      // Add user's params
      queryParams = addParams(queryParams, internals.userParams);
      // Add App default params
      queryParams = addParams(queryParams, internals.defaultParams);

      return queryParams;
    };

    module.searchRecipes = function (query, requestParams={}) {
      return new Promise(function (resolve, reject) {
        if (!query || !query.length) {
          reject({
            'response': 'query is incomplete!',
            'code': 400
          });
        }

        // https://api.yummly.com/v1/api/recipes
        var url = internals.urls.base + internals.urls.searchRecipes;
        // ?onion+soup?requestPictures=true
        var queryParams = module.buildQueryParams(query, requestParams);
        // https://api.yummly.com/v1/api/recipes?onion+soup?requestPictures=true
        var fullUrl = url + queryParams;

        var res = reqHandler.get(fullUrl);
        res.then(function(result) {
          resolve(result);
        }, function(err) {
          reject(err);
        });
      });
    };

    module.getRecipe = function (recipeID) {
      return new Promise(function(resolve, reject) {
        if (!recipeID || !recipeID.length) {
          reject({
            'response': 'missing recipe ID!',
            'code': 400
          });
        }

        // https://api.yummly.com/v1/api/recipe
        var url = internals.urls.base + internals.urls.getRecipe;
        var fullUrl = url + recipeID

        var res = reqHandler.get(fullUrl);
        res.then(function(result) {
          resolve(result);
        }, function(err) {
          reject(err);
        });
      });
    };

    module.getMetadataTypes = function () {
      return internals.metadataKeys;
    };

    module.getMetadata = function (dataType) {
      return new Promise(function(resolve, reject) {
        if (!dataType || !dataType.length) {
          reject({
            'response': 'invalid metadata type!',
            'code': 400
          });
        }

        // https://api.yummly.com/v1/api/metadata
        var url = internals.urls.base + internals.urls.getMetadata;
        var fullUrl = url + dataType + internals.authParams;
        var res = reqHandler.get(fullUrl, {}, 'jsonp');
        res.then(function(result) {
          resolve(result);
        }, function(err) {
          reject(err);
        });
      });
    };

    return module;
}

// once jsonp call is complete for getMetadata, this will be called.
function set_metadata (dataType, data) {
    hrh.jsonpResult = {
      'type': dataType,
      'data': data
    };
};
