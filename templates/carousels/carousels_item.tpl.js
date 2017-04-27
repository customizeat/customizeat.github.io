(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['carousels_item.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"item\">\n  <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.alt_name : stack1), depth0))
    + "\">\n  <div class=\"carousel-caption\">\n    <h3>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n    <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\n    <a href=\"recipe.html?recipeID="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.recipeID : stack1), depth0))
    + "\">\n       Open recipe&nbsp;<span class=\"glyphicon glyphicon-new-window\"></span>\n    </a>\n  </div>\n</div>\n";
},"useData":true});
})();