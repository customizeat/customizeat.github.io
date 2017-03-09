(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['imageTemplates.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"col-sm-6 col-md-4\">\n  <div class=\"thumbnail\">\n    <div class=\"hovereffect\">\n      <img class=\"img-responsive center-block\" src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.alt_name : stack1), depth0))
    + "\">\n        <div class=\"overlay\">\n           <h3> "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.hoverDescription : stack1), depth0))
    + "</h3>\n           <a class=\"info\" href=\"#\"><i class=\"fa fa-clock-o fa-fw\" aria-hidden=\"true\"></i>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.cookTime : stack1), depth0))
    + "</a>\n        </div>\n    </div>\n    <div class=\"caption\">\n      <p style=\"font-size: 1pt;\">&nbsp;</p>\n      <h3>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\n      <p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.json : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\n      <p><button type=\"button\" class=\"btn btn-default btn-sm\" aria-label=\"Left Align\">\n        <span class=\"glyphicon glyphicon-star\" aria-hidden=\"true\"></span> Save\n        </button></p>\n    </div>\n</div>\n</div>\n";
},"useData":true});
})();