/**
 * Dependencies
 */
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const semver = require('semver')
const debug = require('debug')('sunstone:plugin')
const callsite = require('callsite')
const Lifecycle = require('./Lifecycle')
const { AbstractPluginSchema } = require('./schemas')

/**
 * Symbols
 */
const APPLICATION = Symbol()
const COMPONENTS = Symbol()
const DEPENDENCIES = Symbol()
const DEPENDENTS = Symbol()
const REGISTRY = Symbol()
const INJECTOR = Symbol()

/**
 * AbstractPlugin
 */
class AbstractPlugin extends Lifecycle {

  /**
   * constructor
   */
  constructor (pkg, registry) {
    super(pkg) //, { mapping: new JSONMapping({ ... }) })

    this[REGISTRY] = registry
    this[INJECTOR] = registry.injector
    this[APPLICATION] = registry.application
    this[DEPENDENCIES] = [] //new PluginCollection([])
    this[DEPENDENTS] = [] //new PluginCollection([])
    this[COMPONENTS] = [] //new ComponentCollection([])
  }

  /**
   * schema
   */
  static get schema () {
    return AbstractPluginSchema
  }

  /**
   * lifecycle
   */
  static get lifecycle () {}

  // can be eager or lazy
  // can be automatic or manually started
  // can be mortal or immortal
  // can be installed (registered?), starting, active, updating, stopping, stopped

  /**
   * create
   */
  static create (pkg, registry) {
    debug('creating "%s"', pkg.name)
    let ExtendedPlugin = this
    return new ExtendedPlugin(pkg, registry)
  }

  /**
   * register
   *
   * imports a plugin main module, val
   */
  static register (pkg, registry) {
    let plugin = this.create(pkg, registry)
    let validation = plugin.validate()

    if (!validation.valid) {
      // create error conditions and terminate registration
      console.log('PLUGIN', plugin.name, 'is invalid.')
      console.log(validation)
    }

    debug('registering plugin "%s"', pkg.name)

    registry.add(plugin)
  }

  /**
   * resolve
   *
   * - all the dependency and dependent plugins must be registered first
   */
  resolve () {
    let {registry, sunstone} = this
    let {dependencies} = sunstone
    let errors = []

    // TODO check dependencies is an object. if not, create an error condition?
    debug('resolving dependencies for "%s"', this.name)

    Object.keys(dependencies).forEach(name => {
      let range = dependencies[name]
      let dependency = registry.get(name)

      if (!dependency) {
        return errors.push({
          message: `${this.name} ${this.version} requires ${name} ${range} and it appears to be unavailable.`
        })
      }

      if (!semver.satisfies(this.version, range)) {
        return errors.push({
          message: `${this.name} ${this.version} requires ${name} ${range} and version ${dependency.version} is installed.${JSON.stringify(dependency)}`
        })
      }

      this.dependencies.push(dependency)
      dependency.dependents.push(this)
    })

    if (errors.length > 0) {
      return Promise.reject(errors)
    }

    return Promise.resolve(this)
  }

  /**
   * require
   */
  require (modules) {
    if (typeof modules === 'string') {
      let name = modules
      modules = {}
      modules[name] = name
    }

    if (Array.isArray(modules)) {
      modules = _.zipObject(modules, modules)
    }

    Object.keys(modules).forEach(key => {
      this.module(key, modules[key])
    })

    return this
  }

  /**
   * module
   */
  module (name, node_module) {
    debug('initializing module "%s"', name)

    let caller = callsite()[1]
    let callerpath = caller.getFileName()

    if (node_module.charAt(0) === '.') {
      node_module = path.join(path.dirname(callerpath), node_module)
    }

    this.injector.register({
      name,
      type: 'module',
      //plugin: this.name,
      fn: function () {
        return require(node_module)
      }
    })
  }

  /**
   * directory
   */
  directory (name) {
    let caller = callsite()[1]
    let callerpath = caller.getFileName()
    let dirname = path.join(path.dirname(callerpath), name)
    let files = fs.readdirSync(dirname)

    files.forEach(filename => {
      let extname = path.extname(filename)
      let component = path.basename(filename, '.js')
      let modulePath = path.join(dirname, component)

      if (extname === '.js' && component !== 'index') {
        this.module(component, modulePath)
      }
    })
  }

  /**
   * factory
   */
  factory (name, fn) {
    debug('initializing factory "%s"', name)

    this.injector.register({
      name,
      type: 'factory',
      //plugin: this.name,
      fn
    })

    return this
  }

  /**
   * assembler
   */
  assembler (name, fn) {
    let { injector, constructor } = this
    AbstractPlugin.prototype[name] = fn() //fn(injector, this)
    return this
  }


  /**
   * Lifecycle methods
   */

  /**
   * initialize
   */
  initialize () {
    //throw new Error(`Plugin "${this.constructor.name}" does not define initialize method.`)
  }

  start () {}
  stop () {}

  /**
   * component
   *
   * @todo
   * 1. how should namespacing work? are there precendence rules?
   * 2. how do we handle conditions such as unknown component, collision,
   *    or auth fail?
   */
  component (name) {
    return this[INJECTOR].get(name, this)
  }

  /**
   * accessors
   *
   * these values should be accessible but non enumerable and not assignable
   */
  get application () {
    return this[APPLICATION]
  }

  get registry () {
    return this[REGISTRY]
  }

  get injector () {
    return this[INJECTOR]
  }

  get dependencies () {
    return this[DEPENDENCIES]
  }

  get dependents () {
    return this[DEPENDENTS]
  }

  get components () {
    return this[COMPONENTS]
  }

}

/**
 * Export
 */
module.exports = AbstractPlugin



