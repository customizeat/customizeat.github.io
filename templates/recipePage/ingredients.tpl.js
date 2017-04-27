(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ingredients.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "<div style=\"border-bottom: 1px solid #e7e7e7; padding: 5px 0px;\">\n  <span class=\"glyphicon glyphicon-cutlery\" style=\"margin-right: 5px; font-size: 0.8em;\"></span>\n  <span>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</span>\n</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.ingredients : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
})();