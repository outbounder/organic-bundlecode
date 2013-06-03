var BundleCode = require("../index");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;

describe("BundleCode with uglify", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      "root": "/tests/data/",
    },
    "useCache": false,
    "uglify": true
  };

  var bundleCode = new BundleCode(plasma, config);
  
  it("should get user session on PageData chemical", function(next){
    plasma.emit(new Chemical({
      type: "BundleCode",
      target: "index",
    }), function(chemical){
      expect(chemical.data.toString()).toBeDefined();
      expect(chemical.data.toString()).toContain("index");
      next();
    });
  });  

});