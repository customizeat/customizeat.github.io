var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});

var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];
var searchResultTpl = Handlebars.templates['searchResult.hbs'];

$(document).ready(function() {
  replaceCarousel();
  $('#recipeSearchForm').submit(function (event) {
    event.preventDefault();

    // using .class selector returns an array [matchingElem1, matchingElem2],
    // so we must use first() to wrap it as a jquery element.
    var $visibleSearchBox = $('.searchQuery:visible').first();
    var searchQuery = $visibleSearchBox.val();
    /*
    var displaySize = $visibleSearchBox.attr('id') === 'searchQueryLG' ? 'LG' : 'SM';
    var includeIngredients = $('#includeIngredients' + displaySize).val() || '';
    var excludeIngredients = $('#excludeIngredients' + displaySize).val() || '';
    var requestParams = {
      'allowedIngredient[]': [includeIngredients], // this must be a list
      'excludeIngredients[]': [excludeIngredients] // this must be a list
    };
    */

    var resPromise = api.searchRecipes(searchQuery);
    resPromise.then(function(result) {
      console.log(result.response.matches);
      $('#recipeResults').html('');
      var matches = result.response.matches;
      var recipe;
      for (var idx = 0; idx < matches.length; idx++) {
          recipe = matches[idx];
          var minutes = recipe.totalTimeInSeconds % 60;
          var imageURL = recipe.imageUrlsBySize['90'];
          imageURL = imageURL.replace('=s90-c', '=s200-c');
          var recipeJSON = {
              url: imageURL,
              alt_name: recipe.recipeName,
              hoverDescription: 'hoverDescription',
              cookTime: minutes + ' Min.',
              name: recipe.recipeName,
              description: 'description here'
          };
          var recipeResultDiv = searchResultTpl({json: recipeJSON});
          $('#recipeResults').append(recipeResultDiv);
      }
    }, function(err) {
      //err
    });
  });
});

// read from pre compiled template to build html.
// reading from templates/carousels/carousels_item.tpl.js
var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];
var json = {
    url: 'static/dimsum.jpg',
    alt_name: 'dimsum',
    name: 'Dim Sum',
    description: 'Dim Sum is traditionally served during lunch'
};

var carouselsItemDiv = carouselsItemTpl({json: json});

// replace the contents when the button is clicked
function replaceCarousel() {
  $('#recommendation').html('');
  $('#recommendation').append(carouselsItemDiv);
  $('#recommendation').children().first().addClass('active');
}

/*
var metadataPromise = api.getMetadata('allergy');
metadataPromise.then(function(result) {
  console.log('metadata');
  console.log(result);
}, function(err) {
  //err
});
*/

/*
var requestArgs = {'includeIngredient[]': ['beef', 'cognac', 'onion soup mix']};
var queryParams = api.buildQueryParams('onion soup', requestArgs);
console.log(queryParams);
*/
