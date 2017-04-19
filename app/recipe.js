var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var reqHandler = RequestHandler(hrh, crh);
var api = APIInterface(reqHandler, {});

$(document).ready(function () {
  var recipeID = 'Kim-Cheese-Fries-1048487';
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
    var info = resp;
    info.calories = resp.nutritionEstimates[0].value;
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
});
