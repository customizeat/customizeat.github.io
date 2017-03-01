var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});

$(document).ready(function() {
  $('#recipeSearchForm').submit(function (event) {
    event.preventDefault();
    var searchQuery = $('#searchQuery').val();
    var resPromise = api.searchRecipes(searchQuery);
    resPromise.then(function(result) {
      console.log('res');
      console.log(result);
    }, function(err) {
      //err
    });
  });
});

var metadataPromise = api.getMetadata('allergy');
metadataPromise.then(function(result) {
  console.log('metadata');
  console.log(result);
}, function(err) {
  //err
});
