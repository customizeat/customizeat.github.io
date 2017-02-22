var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});

$(document).ready(function() {
  $('#recipeSearchForm').submit(function (event) {
    event.preventDefault();
    var searchQuery = $('#searchQuery').val();
    api.searchRecipes(searchQuery);
  });
});
