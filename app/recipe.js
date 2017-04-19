var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});
var queryString = parseQueryString();
var recipeID = queryString.recipeID;
var allowedNutritionAttr = [
  'K', 'NA', 'CHOLE', 'FATRN', 'FASAT', 'CHOCDF', 'FIBTG', 'PROCNT', 'VITC',
  'CA', 'FE', 'SUGAR', 'ENERC_KCAL', 'FAT', 'VITA_IU'
];

$(document).ready(function () {
  if (recipeID && recipeID.length) {
    $('#recipeContent').show();
    loadPage();
  } else {
    $('#content404').show();
  }
});

function parseQueryString () {
  var parsedParameters = {},
    uriParameters = location.search.substr(1).split('&');

  for (var i = 0; i < uriParameters.length; i++) {
    var parameter = uriParameters[i].split('=');
    parsedParameters[parameter[0]] = decodeURIComponent(parameter[1]);
  }

  return parsedParameters;
}

function loadPage() {
  var recipeInfo = api.getRecipe(recipeID);
  recipeInfo.then(function (res) {
    console.log(res);
    var resp = res.response;
    // attribution and source
    $('#attribution').html(resp.attribution.html);
    $('#sourceDisplayName').text(resp.source.sourceDisplayName);
    $('#sourceSiteUrl').text(resp.source.sourceSiteUrl);
    $('#sourceSiteUrl').attr('href', 'http://' + resp.source.sourceSiteUrl);

    // picture
    var imageHtml = "<img class='img-responsive center-block img-thumbnail' src='" + resp.images[0].hostedLargeUrl + "'/>";
    $('#recipeImage').html(imageHtml);

    // recipe info
    var recipeInfoTpl = Handlebars.templates['recipeInfo.hbs'];
    var info = Object.assign({}, resp);
    info.nutritionEstimates = [];
    for (var i in resp.nutritionEstimates) {
      var nutr = resp.nutritionEstimates[i];
      if (allowedNutritionAttr.indexOf(nutr.attribute) !== -1) {
        info.nutritionEstimates.push(nutr);
        if (nutr.attribute === 'ENERC_KCAL') {
          info.calories = nutr.value;
        }
      }
    }
    var recipeInfoHtml = recipeInfoTpl({info: info});
    $('#recipeInfo').html(recipeInfoHtml);

    // ingredients
    var ingredientsTpl = Handlebars.templates['ingredients.hbs'];
    var ingredientsHtml = ingredientsTpl({ingredients: resp.ingredientLines});
    $('#ingredients').html(ingredientsHtml);

    // directions resp.source.sourceRecipeUrl
    /*var iframe = "<iframe src='" + resp.source.sourceRecipeUrl + "'><iframe>";
    $('#directions').html(iframe);*/
  }, function (error) {
    console.log(error);
  });
}
