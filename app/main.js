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
    var searchFilters = parseSearchFilter();
    searchFilters.start = nextStart;
    var resPromise = api.searchRecipes(searchQuery, searchFilters);
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
  enableTagsinput();
  syncSearchFilters();
  replaceCarousel();
  loadRecipesOfTheWeek();

  $('#recipeSearchForm').submit(function (event) {
    event.preventDefault();

    // using .class selector returns an array [matchingElem1, matchingElem2],
    // so we must use first() to wrap it as a jquery element.
    var $visibleSearchBox = $('.searchQuery:visible').first();
    var searchQuery = $visibleSearchBox.val();

    $('#myCarousel').hide();
    $('#carouselTitle').hide();

    searchNext(searchQuery);
  });
});

var carouselsItemlist = [];
function loadRecipesOfTheWeek() {
  var recipesOfTheWeek =
  [
    'Hearty-Tuscan-soup-1416718',
    'Hamburger-Soup-2054140',
    'Kim-Cheese-Fries-1048487',
    'Fettucini-Bolognese-1020206',
    'Steaks-1833976'
  ];
  var count = recipesOfTheWeek.length;
  for (var i = 0; i < recipesOfTheWeek.length; i++) {
    var recipeInfo = api.getRecipe(recipesOfTheWeek[i]);
    recipeInfo.then(function (res) {
      // do something with the api result
      var json = {
        url: res.response.images[0].hostedLargeUrl,
        name: res.response.name,
        alt_name: res.response.id,
        description : res.response.attributes.course,
        recipeID : res.response.id
      };
      carouselsItemlist.push(json);
      count--;
      if (count == 0) {
        replaceCarousel();
      }
    }, function (error) {
      // err handling
    })
  }
}

// read from pre compiled template to build html.
// reading from templates/carousels/carousels_item.tpl.js
var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];
// replace the contents when the button is clicked
function replaceCarousel() {
  $('#recommendation').html('');
  for (var i = 0; i < carouselsItemlist.length; i++) {
    var json = carouselsItemlist[i];
    var carouselsItemDiv = carouselsItemTpl({json: json});
    $('#recommendation').append(carouselsItemDiv);
  }

  for (var j = 0; j < carouselsItemlist.length; j++) {
    $('#myCarousel .carousel-indicators').append('<li data-target="#myCarousel" data-slide-to="' + j + '"></li>');
  }
  $('#recommendation').children().first().addClass('active');
  $('#myCarousel .carousel-indicators').children().first().addClass('active');
}

function parseSearchFilter() {
    var searchFilters = {};
    var parseFromLargeView = $('#searchQueryLG').is(':visible');
    // decide which one of the input fields to parse from depending on the view
    var filtersClass = parseFromLargeView ? 'search-filters-lg' : 'search-filters-sm';
    $('#searchFilters .' + filtersClass).each(function () {
        var filterItems = $(this).tagsinput('items');
        var filterSearchValues = [];
        for (var i = 0; i < filterItems.length; i++) {
            filterSearchValues.push(filterItems[i].searchValue);
        }
        var paramKey = $(this).attr('paramKey'); // paramKey for e.g. allowedIngredient[]
        searchFilters[paramKey] = filterSearchValues;
    });

    return searchFilters;
}

function syncSearchFilters() {
  // setup syncing for .search-filters-lg
  $('.search-filters-lg').each(function () {
    // setup onchange watcher
    var largeInputID = $(this).attr('id');
    var smallInputID = largeInputID.replace('LG', 'SM');

    $('#' + largeInputID).on('itemAdded', function(event) {
        // event.item: contains the item
        $('#' + smallInputID).tagsinput('add', event.item);
    });

    $('#' + largeInputID).on('itemRemoved', function(event) {
        // event.item: contains the item
        $('#' + smallInputID).tagsinput('remove', event.item);
    });
  });
  // setup syncing for .search-filetrs-sm
  $('.search-filters-sm').each(function () {
    // setup onchange watcher
    var smallInputID = $(this).attr('id');
    var largeInputID = smallInputID.replace('SM', 'LG');

    $('#' + smallInputID).on('itemAdded', function(event) {
        // event.item: contains the item
        $('#' + largeInputID).tagsinput('add', event.item);
    });

    /* if condition - check taginpus if there is ingredient that wants to be removed and if not do not run this code */
    $('#' + smallInputID).on('itemRemoved', function(event) {
        // event.item: contains the item
        $('#' + largeInputID).tagsinput('remove', event.item);
    });
  });
}



function enableTagsinput() {
    var parseFromLargeView = $('#searchQueryLG').is(':visible');
    var appParams = api.getAppParams();
    $('#searchFilters .search-filters-lg, #searchFilters .search-filters-sm' ).each(function () {
        var $filterInput = $(this);
        var paramKey = $filterInput.attr('paramKey'); // e.g. 'allowedIngredient[]'
        var metadataType = appParams[paramKey].metadataType; // read internals from APIInterface
        var metadataPromise = api.getMetadata(metadataType);
        metadataPromise.then(function(result) {
          var metadataArr = [];
          for (var item in result.response) {
              var metadataObj = result.response[item];
              // some metadata do not have description attribute, so instead use shortDescription
              metadataObj.description = metadataObj.shortDescription || metadataObj.description;
              metadataArr.push(metadataObj);
          }

          // necessary stuff for typeahead engine
          var searchFilter = new Bloodhound({
              datumTokenizer: Bloodhound.tokenizers.obj.whitespace('description'),
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              local: metadataArr
          });
          searchFilter.initialize();
          $filterInput.tagsinput({
              itemValue: 'searchValue',
              itemText: 'description',
              typeaheadjs: {
                  name: $filterInput.attr('id'),
                  displayKey: 'description',
                  source: searchFilter.ttAdapter()
              }
          });
        }, function(err) {
          //err
        });
    });
}
