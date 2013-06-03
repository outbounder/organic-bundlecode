var util = require("util");
var Organel = require("organic").Organel;
var Chemical = require("organic").Chemical;

var fs = require("fs");
var path = require("path");
var browserify = require('./lib/Bundle');
var through = require("through");

var UglifyJS = require("uglify-js");

var _ = require("underscore");
var path = require("path");

/* incoming | BundleCode

* code - String

  path (will be prefixed with `root` value if provided) to the main entry point to be used for creating a bundle

* root - String

  *optional* path which will be used to prefix `code` main entry path


## Response Chemical Structure ##

  * data - `String` 
  
    compiled bundle contents


*/

/* organel | BundleCode

Basic Organelle which wraps browserify v2.x.x 

* `cwd` - Object

  *optional* object containing key:values, where values will be prefixed with `process.cwd()` and placed within config itself with coresponding keys

  Useful to provide `root` value relative to current working directory

* `root` - String

  *optional*, represents the root value to be added in forming bundle code entry point.

* `useCache` - false

  Will bundle given entry points and all its dependencies only once and cache them in memory.

* `uglify` - false

  Will uglify and compress the bundle using `uglify-js`

* `code` - String

  *optional*, represents the default bundle entry points to be used if missing in incoming chemicals

* `plugins` - [ PluginObject ]

  #### Plugin Object 
  
  * `String` - full path to Plugin source code or

            {
             source: full path to Plugin source code
             ... `config` of Plugin
            }

    #### plugin source code example

        module.exports = function(`client`, `config`){
          var through = client.through; // through module
          var bundle = client.bundle; // bundle instance
        }

    see (https://github.com/substack/node-browserify#btransformtr)[transforms]

*/

module.exports = function BundleCode(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  var cache = {};
  if(config.useCache)
    console.log("using code caching");
  
  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];

  var pluginsRoot = config.root || process.cwd();
  this.config = config;

  this.on("BundleCode", function(chemical, sender, callback){

    var target = (chemical.root || config.root || "")+(chemical.target || chemical.code);
    
    if(cache[target] && config.useCache) {
      chemical.data = cache[target];
      return callback(chemical);
    }

    // combine
    var b = browserify([target]);
    var pluginArgs = {
      through: through,
      bundle: b
    };
    if(config.plugins) {
      config.plugins.forEach(function(pluginDna){
        var file = pluginDna.source;
        if(typeof pluginDna == "string") {
          file = pluginDna;
          pluginDna = config;
        }
        require(path.join(pluginsRoot,file))(pluginArgs, pluginDna);
      })
    }
    b.bundle({debug: config.debug}, function(err, src){
      if(err) return callback(err);

      cache[target] = src;

      if(config.uglify)
        cache[target] = UglifyJS.minify(cache[target], {fromString: true}).code;
      cache[target] = new Buffer(cache[target]);
      chemical.data = cache[target];

      callback(chemical);
    });
  });
}

util.inherits(module.exports, Organel);