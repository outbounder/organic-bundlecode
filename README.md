# incoming | BundleCode

* code - String

  path (will be prefixed with `root` value if provided) to the main entry point to be used for creating a bundle

* root - String

  *optional* path which will be used to prefix `code` main entry path


## Response Chemical Structure ##

  * data - `String` 
  
    compiled bundle contents

# organel | BundleCode

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