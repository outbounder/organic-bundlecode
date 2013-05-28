var BundleCode = require("../index");
var Plasma = require("organic").Plasma;
var Chemical = require("organic").Chemical;
var path = require("path");

describe("BundleCode With Plugins", function(){
  
  var plasma = new Plasma();
  var config = {
    "cwd": {
      "root": "/tests/data"
    },
    "useCache": false,
    "debug": false,
    "plugins": ["/plugins/plugin"]
  };

  var bundleCode = new BundleCode(plasma, config);
  
  it("should compile with transformation", function(next){
    plasma.emit(new Chemical({
      type: "BundleCode",
      target: "/indexPluggins",
    }), function(chemical){
      expect(chemical.data.toString()).toBeDefined();
      expect(chemical.data.toString()).toContain("index");
      expect(chemical.data.toString()).toContain("test1");
      expect(chemical.data.toString()).toContain("test2");
      expect(chemical.data.toString()).toContain("test3");
      expect(chemical.data.toString()).toContain("testmoduleA");
      next();
    });
  });

});