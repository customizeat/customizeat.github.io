function APIInterface(reqHandler, userParams = {}) {
    var module = {
      urls: {
        base: 'https://api.yummly.com/v1/api',
        searchRecipes: '/recipes', // recipes?q
        getRecipe: '/recipe/', // recipe/recipe-id?
        getMetadata: '/metadata/' // metadata/ingredient?
      },
      authParams: '?_app_id=9cce27e7&_app_key=b13c741344519e5f89cb0edb7e8043f6'
    };
    module.defaultParams = {
        requirePictures: 'true'
    };
    module.userParams = userParams;

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
      queryParams = addParams(queryParams, module.userParams);
      // Add App default params
      queryParams = addParams(queryParams, module.defaultParams);

      return queryParams;
    };

    module.searchRecipes = function (query) {
      if (!query || !query.length) { return; }

      // https://api.yummly.com/v1/api/recipes
      var url = module.urls.base + module.urls.searchRecipes;
      // ?onion+soup?requestPictures=true
      var queryParams = module.buildQueryParams(query);
      // https://api.yummly.com/v1/api/recipes?onion+soup?requestPictures=true
      var fullUrl = url + queryParams;

      console.log('querying fullUrl: ' + fullUrl);
      var res = reqHandler.get(fullUrl);
      res.then(function(result) {
        console.log('successfully fetched recipes');
        console.log(result); // "it worked!"
      }, function(err) {
        console.log('failure');
        console.log(err); // Error: "It broke"
      });
    };

    module.getRecipe = function (recipeID) {
        if (!recipeID || !recipeID.length) { return; }

        // https://api.yummly.com/v1/api/recipe
        var url = module.urls.base + module.urls.getRecipe;
        var fullUrl = url + recipeID

        var res = reqHandler.get(fullUrl);
        res.then(function(result) {
          console.log('successfully fetched recipe info');
          console.log(result);
        }, function(err) {
          console.log('failure');
          console.log(err);
        });
    };

    module.getMetadata = function (dataType) {
      if (!dataType || !dataType.length) { return; }

      // https://api.yummly.com/v1/api/metadata
      var url = module.urls.base + module.urls.getMetadata;
      var fullUrl = url + dataType + module.authParams;
      console.log(fullUrl);
      var res = reqHandler.getJSONP(fullUrl);
      res.then(function(result) {
        console.log('successfully fetched metadata info');
        console.log(result);
      }, function(err) {
        console.log('failure');
        console.log(err);
      });
    };

    return module;
}
