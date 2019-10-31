# Sunstone Plugin Architecture

## Extensible Applications

### Why

- allow users of the software to customize behavior without maintaining forks and submitting PRs
- keep the footprint small and avoid bloat by only downloading/deploying/running what's needed
- lower the time, cost, effort, and other barriers to entry for contributing
- minimize project management communication, bikeshedding, and unconstructive debate about features 
- lower the burden of maintenance, documentation, and support
- speed the deployment of new features
- hot/automatic updates and easier adaptation to changing requirements
- avoid technical debt by encouraging meaningfully scoped components and good design


### How

The `sunstone` package provides a plugin architecture.

```
                   +---------------------------------------------------------+
                   | +-----------------------+  +--------------------------+ |
                   | | +--------+ +--------+ |  | +--------+ +-----------+ | |
Assembled App      | | |V1 V2 V3| |V4 V5 V6| |  | |V7 V8 V9| |V10 V11 V12| | |
                   | | |        | |        | |  | |        | |           | | |
Component Injector | | |C1 C2 C3| |C4 C5 C6| |  | |C7 C8 C9| |C10 C11 C12| | |
                   | | |        | |        | |  | |        | |           | | |
Plugin Registry    | | |   P1   | |   P2   | |  | |   P3   | |    P4     | | |
                   | | ---------+ +--------+ |  | +--------+ +-----------+ | |
                   | |                       |  |                          | |
Packaging          | |    ./node_modules     |  |       ./plugins          | |
                   | +-----------------------+  +--------------------------+ |
                   |                                                         |
                   |                    PLUGIN HOST APP                      |
                   +---------------------------------------------------------+


                       +-------------------------------------------------+
                       | +---------------------+ +---------------------+ |
                       | | +-------+ +-------+ | | +-------+ +-------+ | |
                       | | |V13 V14| |V15 V16| | | |V17 V18| |V19 V20| | |
                       | | |       | |       | | | |       | |       | | |
                       | | |C13 C14| |C15 C16| | | |C17 C18| |C19 C20| | |
                       | | |       | |       | | | |       | |       | | |
                       | | |   P5  | |  P6   | | | |  P7   | |  P8   | | |
                       | | +-------+ +-------+ | | +-------+ +-------+ | |
                       | |                     | |                     | |
                       | |   ./node_modules    | |      ./plugins      | |
                       | +---------------------+ +---------------------+ |
                       |                                                 |
                       |                  EXTENDING APP                  |
                       +-------------------------------------------------+
                       
```

Apps built with Sunstone are both organized internally and extended using plugins. Creating an application is virtually the same as extending one. 

```
├── app.js
├── package.json
├── node_modules
│   ├── P1
│   ├── P2
│   └── P3
└── plugins
    ├── P4
    └── P5
```

The main module of the package simply requires, configures, and exports `sunstone`. Everything else is done in plugins included as npm dependendencies or defined in a plugins directory.
  
```javascript
// myExensibleApp.js
module.exports = require('sunstone').create({
  basePaths: [
    __dirname,
    process.cwd()
  ]
})
```
 
- users of the host app can then
  - further configure sunstone, if necessary or desireable
  - install and/or create new plugins that extend the app
  - invoke `start()` or export the app to be further extended

```javascript
require('./myExtensibleApp').start()
```

## Plugins and the Registry

- plugins are structured as npm packages
- each plugin must have a package.json file and a main module
- plugins are named and verioned with semver
- plugins have dependencies specified with semver (separate, but overlapping with package dependencies)
- plugins are loaded from node_modules and "local" directories configured for the host and extending apps
- main module specified in package.json must export a class that extends sunstone.Plugin

##### Example plugin directory structure
```
./my-plugin
├── MyPlugin.js
└── package.json
```

##### Example plugin package.json file

```json
{
  "name": "my-plugin",
  "version": "0.1.3",
  "description": "New feature for customized app",
  "main": "./MyPlugin.js",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/organization/my-plugin.git"
  },
  "license": "MIT",
  "sunstone": {
    "engine": ">=0.1.0",
    "type": "plugin",
    "dependencies": {
      "other-plugin": "1.0.2",
      "not-a-plugin": "2.3.4"
    }
  }
}
```

##### Example main plugin module

```javascript
const { Plugin } = require('sunstone')

class MyPlugin {
  // plugin implementation
  
  // lifecycle methods
  initialize () {
    // register components and component factories on the injector here
  }
  
  start () {}
  
  stop () {}
}

module.exports = MyPlugin
```

- at runtime, plugins are instantiated and live in memory on the registry
- each plugin knows where it comes from (main module) either by filesystem location or installed/linked package name
- each plugin knows if it belongs to the host or extending apps
- each plugin has access to parsed "package.json" contents
- plugins must know how to add and remove their features/state/behavior to and from a running app

##### Example app directory structure

```
├── app.js
├── package.json
├── node_modules
│   ├── sunstone-logging
│   │   ├── LoggingPlugin.js
│   │   └── package.json
│   ├── sunstone-server
│   │   ├── ServerPlugin.js
│   │   └── package.json
│   └── sunstone-server-settings
│       ├── SettingsPlugin.js
│       └── package.json
└── plugins
    └── ...
```

## Components and the Injector

- components are named and their name must be a valid JavaScript variable
- components are namespaced with the plugin name
- plugins register components on the injector during their "initialize" lifecycle phase
- plugins maintain references to components they register on the injector
- components on the injector know their plugin
- plugins can make other components available within the scope of their components' definition using the injector
- the injector provides components to plugin modules
- the injector enforces "security" rules
- the injector is injectable
- the registry is injectable
- the controller of app lifecycle is injectable (within host application)

## Application and Plugin Lifecycles
- apps and plugins have a lifecycle
- plugins can be installed, started, and stopped at runtime, enabling changes to application behavior without restarting the server
- the stages of the app lifecycle are 
  - `configure`
  - `start`
  - `stop`
  - `restart`
- the stages/events of the plugin/registry/injector lifecycle are 
  - `install` – install plugins from npm or git to node_modules (modifying package.json dependencies) or the runner's plugin dir(s)
  - `discover` – find plugin main modules in node_modules and configured plugin directories
  - `reload` – require discovered plugin main modules, instantiate plugin instances, add components to registry, clear relevant require.cache entries 
  - `resolve`/`prioritize` – ensure all dependencies are available and order such that each plugin's dependencies are satisfied before initializing
  - `initialize` – registers plugin components on the injector, without invoking factory functions
  - `enable`
  - `start`
  - `stop`
  - `reset`
  - `restart`
  - `disable`
  - `remove` – uninstall a plugin package using npm
  - `snapshot` – save the current plugin configuration
  - `restore` – restore the saved plugin configuration (should this be versioned?)
- apps are configured and run
- running an app bootstraps it
- bootstrapping involves
  - discover, reload, resolve/prioritize, initialize, run, start

## Plugin Configuration and Application State

- Plugins can be started, stopped, enabled, disabled
- At any time a plugin can be in one state
- That state may change during runtime and it is necessary to persist it in some way to restore when restarting the process
- Plugins can also have their own configuration which can be changed at runtime and needs to be persisted for restarts

```json
// plugins.json
{
  "plugins": {
    "plugin-name": {
      "state": "enabled",
      "config": {
        "...": "..."
      }
    }
  }
}
```
   
## Dependencies and Lifecycle Constraints

- plugins know their dependencies
- plugins know their dependents    
- starting a plugin requires its dependencies to be started/running
- enabling a plugin requires its dependencies to be enabled
- stopping a plugin requires its dependants to be stopped
- disabling a plugin requires its dependants to be disabled   
   
## Plugin and Component Security
- plugins can be authenticated by the registry and the injector (source/content)
- plugins' components can be authorized
  - components can be private to plugin
  - components can be private to app
  - components can be available to specified
    - component types
    - plugins
    - components
    - publishers
    - authors
    - license
    - keywords

## Remaining Questions

- HOW DO WE HANDLE PLUGIN/COMPONENT NAME COLLISIONS?