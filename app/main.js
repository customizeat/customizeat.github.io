var crh = CacheRequestHandler();
var hrh = HttpRequestHandler();
var rh = RequestHandler(hrh, crh);

var url = "https://api.yummly.com/v1/api/recipes?q=onion+soup&_app_id=9cce27e7&_app_key=b13c741344519e5f89cb0edb7e8043f6";
console.log('fetching url: ' + url);
var res = rh.get(url); // this returns a promise Object
res.then(function(result) {
  console.log('successfully fetched data');
  console.log(result); // "it worked!"
}, function(err) {
  console.log('failure');
  console.log(err); // Error: "It broke"
});
