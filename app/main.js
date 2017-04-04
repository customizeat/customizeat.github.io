var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});

var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];
var searchResultTpl = Handlebars.templates['searchResult.hbs'];

var lastSearch = {
    searchQuery: '',
    start: 0,
    result: {}
};

function searchNext (searchQuery) {
    // if both are empty, then return!
    if (!searchQuery.length && !lastSearch.searchQuery.length) {
        return;
    }

    if (searchQuery.length) { // new query coming from the form input
        lastSearch.searchQuery = '';
    } else { // this is the case for manual load more button clicking.
        searchQuery = lastSearch.searchQuery;
    }

    // calculate start for the next api call,
    // returns -1 if start cannot be incremented any more (max count reached)
    var getNextStart = function (searchQuery, lastResult) {
        // case 1, searchQuery is different!
        if (searchQuery !== lastSearch.searchQuery) {
            return 0;
        }
        else if (lastSearch.start >= lastResult.response.totalMatchCount - 1) {
            // case 2 max count reached
            return -1;
        } else {
            // case 3 usual increment
            return lastSearch.start + lastResult.response.matches.length;
        }
    };

    var nextStart = getNextStart(searchQuery, lastSearch.result);
    if (nextStart === -1) {
        return; // exit early here, we do not need to query!
    }

    $('#loadingModal').modal('show');
    var resPromise = api.searchRecipes(searchQuery, { start: nextStart});
    resPromise.then(function(result) {
        displayResult(result, searchQuery);
        lastSearch.start += nextStart;
        lastSearch.searchQuery = searchQuery;
        lastSearch.result = result;
        $('#loadingModal').modal('hide');
    }, function(err) {
      //err
        $('#loadingModal').modal('hide');
    });
}

function resizeSearchResults() {
    var maxHeight = 0;
    $('#recipeResults').children().each(function () {
        maxHeight = $(this).height() >= maxHeight ? $(this).height() : maxHeight;
    });
    $('#recipeResults').children().css('height', maxHeight);
}

function displayResult (result, searchQuery) {
    var totalMatchCount = result.response.totalMatchCount;
    if (lastSearch.searchQuery != searchQuery) {
        var panelTitle = '<u>' + totalMatchCount + '</u> <em>recipe results for</em> &quot;<mark>'
                                  + searchQuery + '</mark>&quot';
        $('#resultsTitle').html(panelTitle);
        $('#recipeResults').html('');
        $('#resultsPanel').show();
    }

    var matches = result.response.matches;
    var recipe;
    function secondsToHM(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);

        var hDisplay = h > 0 ? h + " Hr " : "";
        var mDisplay = m > 0 ? m + " Min " : "";
        return hDisplay + mDisplay;
    }

    var imagesToLoad = matches.length || 0;
    for (var idx = 0; idx < matches.length; idx++) {
        recipe = matches[idx];
        var imageURL = recipe.imageUrlsBySize['90'];
        imageURL = imageURL.replace('=s90-c', '=s200-c');
        var hm = secondsToHM(recipe.totalTimeInSeconds);
        var recipeJSON = {
            recipeID: recipe.id,
            url: imageURL,
            alt_name: recipe.recipeName,
            cookTime: hm,
            name: recipe.recipeName,
            source: recipe.sourceDisplayName
        };
        var recipeResultDiv = searchResultTpl({json: recipeJSON});
        $('#recipeResults').append(recipeResultDiv);
        var $img = $('#recipeResults div.thumbnail[recipeId="' + recipe.id + '"] img');
        img = $img.get(0);
        img.onload = function () {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                resizeSearchResults();
            }
        };
    }

    if (lastSearch.start + matches.length >= result.response.totalMatchCount - 1) {
        $('#loadMoreBtn').hide();
    } else {
        $('#loadMoreBtn').show();
    }
}

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

    searchNext(searchQuery);
  });
});

var list = [];
var recipesofTheWeek = ['Hearty-Tuscan-soup-1416718', 'Hamburger-Soup-2054140'];
for (var i = 0; i < recipesofTheWeek.length; i++) {
  var recipeInfo = api.getRecipe(recipesofTheWeek[i]);
  //console.log(recipeInfo);
  recipeInfo.then(function (res) {
    // do something with the api result
    console.log(res);
    var json = {
      url: 'static/pizza.png',
      name: res.response.name,
      alt_name: res.response.id,
      description : 'I don\'t know'
    };
    // now in here, update the carousel using the info(build templates
    // here using the api data)
    list.push(json);
  }, function (error) {
    // err handling
  })
}


// read from pre compiled template to build html.
// reading from templates/carousels/carousels_item.tpl.js
var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];

//
// var json2 = {
//     url: 'static/pizza.png',
//     alt_name: 'pizza',
//     name: 'Pizza',
//     description: 'pizza is traditionally served during lunch'
// };

// var carouselsItemDiv = carouselsItemTpl({json: json});

// replace the contents when the button is clicked
function replaceCarousel() {
  $('#recommendation').html('');
  for (var i = 0; i < list.length; i++) {
    var json = list[i];
    var carouselsItemDiv = carouselsItemTpl({json: json});
    $('#recommendation').append(carouselsItemDiv);
  }
  // $('#recommendation').append(carouselsItemDiv);
  $('#recommendation').children().first().addClass('active');
}
