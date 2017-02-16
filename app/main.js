var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var rh = RequestHandler(hrh, crh);
//var Handlebars = Handlebars();

var url = "https://api.yummly.com/v1/api/recipes?q=onion+soup&_app_id=9cce27e7&_app_key=b13c741344519e5f89cb0edb7e8043f6";
//console.log('fetching url: ' + url);
var res = rh.get(url); // this returns a promise Object
res.then(function(result) {
  //console.log('successfully fetched data');
  //console.log(result); // "it worked!"
}, function(err) {
  //console.log('failure');
  //console.log(err); // Error: "It broke"
});

// this should show pre compiled templates.
console.log(Handlebars.templates);
console.log(Handlebars.templates['carousels_item.hbs']);

// read from pre compiled template to build html.
var carouselsItemTpl = Handlebars.templates['carousels_item.hbs'];
var json = {
    url: 'http://vikschaat.com/wp-content/uploads/2015/03/food_900x500-9-900x500.png',
    alt_name: 'altImg',
    name: 'foodName',
    description: 'foodDescription'
};
var carouselsItemDiv = carouselsItemTpl({json: json});
console.log(carouselsItemDiv);

// compile handlebars template on the fly
var json2 = {
    url: 'static/dimsum.jpg',
    alt_name: 'dimsum',
    name: 'Dim Sum',
    description: 'Dim Sum is traditionally served during lunch'
};
var tplOnTheFly = '<div class="item">' +
  '<img src="{{json.url}}" alt="{{json.alt_name}}">' +
  '<div class="carousel-caption">' +
    '<h3>{{json.name}}</h3>' +
    '<p>{{json.description}}</p>' +
  '</div>' +
'</div>';
var tplCompiled = Handlebars.compile(tplOnTheFly);
console.log(tplCompiled);
var tplBuilt = tplCompiled({json: json2});
console.log(tplBuilt);

// replace the contents when the button is clicked
function replaceCarousel() {
  $('div.carousel-inner').html('');
  $('div.carousel-inner').append(carouselsItemDiv);
  $('div.carousel-inner').append(tplBuilt);
  $('div.carousel-inner').children().first().addClass('active');
}

$(document).ready(function() {
  // uncomment to replace as soon as document loads.
  /*
  $('div.carousel-inner').html('');
  $('div.carousel-inner').append(carouselsItemDiv);
  $('div.carousel-inner').append(tplBuilt);
  $('div.carousel-inner').children().first().addClass('active');
  */
});
