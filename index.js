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

module.exports = function BundleCode(plasma, config){
  Organel.call(this, plasma);

  var self = this;
  this.cache = {};
  if(config.useCache)
    console.log("using code caching");
  
  if(config.cwd)
    for(var key in config.cwd)
      config[key] = process.cwd()+config.cwd[key];

  
  this.config = config;
  this.config.pluginsRoot = this.config.root || process.cwd();

  this.on("BundleCode", this.message);
}

util.inherits(module.exports, Organel);

module.exports.prototype.message = function(chemical, callback){
  var self = this;

  var target = (chemical.root || this.config.root || "")+(chemical.target || chemical.code);

  if(this.cache[target] && this.config.useCache) {
    chemical.data = this.cache[target];
    return callback(chemical);
  }

  // combine
  var b = browserify([target]);
  var pluginArgs = {
    through: through,
    bundle: b
  };
  if(this.config.plugins) {
    this.config.plugins.forEach(function(pluginDna){
      var file = pluginDna.source;
      if(typeof pluginDna == "string") {
        file = pluginDna;
        pluginDna = self.config;
      }
      require(path.join(self.config.pluginsRoot,file))(pluginArgs, pluginDna);
    })
  }
  if(!chemical.pipe)
    b.bundle({debug: this.config.debug}, function(err, src){
      if(err) return callback(err);

      self.cache[target] = src;
      self.cache[target] = new Buffer(self.cache[target]);
      if(self.config.uglify)
        self.cache[target] = UglifyJS.minify(self.cache[target].toString(), {fromString: true}).code;
      chemical.data = self.cache[target];
      if(callback)
        callback(chemical);
    });
  else
    callback(b.bundle({debug: this.config.debug}));
}