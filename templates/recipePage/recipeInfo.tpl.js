(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['recipeInfo.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "          <div><span>\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.description : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "        </span>:&nbsp;"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "&nbsp;"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.unit : depth0)) != null ? stack1.plural : stack1), depth0))
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "            "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.description : depth0), depth0))
    + "\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "            "
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.attribute : depth0), depth0))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<ul class=\"list-group\">\n  <li class=\"list-group-item\">\n    <span class=\"label color-customizeat\">Cook Time</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.cookTime : stack1), depth0))
    + "\n    <span class=\"label color-customizeat\">Prep Time</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.prepTime : stack1), depth0))
    + "\n    <span class=\"label color-customizeat\">Total Time</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.totalTime : stack1), depth0))
    + "\n  </li>\n  <li class=\"list-group-item\"><span class=\"label color-customizeat\">\n    Serves</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.numberOfServings : stack1), depth0))
    + "\n  </li>\n  <li class=\"list-group-item\">\n    <span class=\"label color-customizeat\">Calories</span> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.calories : stack1), depth0))
    + " Kcal\n    </li>\n  <li class=\"list-group-item\">\n    <button class=\"btn btn-sm btn-default\" type=\"button\" data-toggle=\"collapse\" data-target=\"#collapseExample\" aria-expanded=\"false\" aria-controls=\"collapseExample\">\n      Nutrition Facts&nbsp;<span class=\"caret\"></span>\n    </button>\n    <div class=\"collapse\" id=\"collapseExample\" style=\"margin-top: 10px;\">\n      <div class=\"well well-white\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.nutritionEstimates : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </div>\n    </div>\n  </li>\n</ul>\n";
},"useData":true});
})();