/**
 * Dependencies
 */
const _  = require('lodash')
const path = require('path')
const glob = require('glob')
//const uuid = require('uuid')
const debug = require('debug')('sunstone:registry')
const Lifecycle = require('./Lifecycle')
const ComponentInjector = require('./ComponentInjector')
const { PluginRegistrySchema } = require('./schemas')

/**
 * Symbols
 */
const APPLICATION = Symbol()
const PLUGINS = Symbol()
const INJECTOR = Symbol()
const REGISTERED = Symbol()
const UNREGISTERED = Symbol()

/**
 * PluginRegistry
 */
class PluginRegistry extends Lifecycle {

  /**
   * constructor
   */
  constructor (app) {
    super(app)

    this[PLUGINS] = {}
    this[INJECTOR] = ComponentInjector.create(this)
    this[APPLICATION] = app
    this[REGISTERED] = new Set()
    this[UNREGISTERED] = new Set()
  }

  /**
   * schema
   */
  static get schema () {
    return PluginRegistrySchema
  }

  /**
   * lifecycle
   */
  static get lifecycle () {}

  /**
   * create
   */
  static create (app) {
    debug('creating plugin registry')
    return new PluginRegistry(app)
  }

  /**
   * add
   */
  add (plugin) {
    let {name} = plugin
    this[PLUGINS][name] = plugin
    debug('add plugin: %s', name)
  }

  set () {}

  get (name) {
    debug('get plugin: %s', name)
    return this[PLUGINS][name]
  }

  del () {}

  filter () {}

  /**
   * Bootstrapping methods
   */

  /**
   * discover
   */
  discover () {
    let registered = this[REGISTERED]
    let discovered = new Set()
    debug('Discovering...')

    this.basePaths.forEach(basePath => {
      this.directories.forEach(directory => {
        let pattern = path.join(basePath, directory, '*', 'package.json')
        glob.sync(pattern).forEach(file => discovered.add(file))
      })
    })

    this[UNREGISTERED] = new Set([...discovered].filter(x => !registered.has(x)))
    debug('discovered %s potential new plugins', this[UNREGISTERED].size)
  }

  /**
   * register
   */
  register () {
    let registered = this[REGISTERED]
    let unregistered = this[UNREGISTERED]

    debug('registering plugins')

    unregistered.forEach(filepath => {
      let pkg = require(filepath)

      if (pkg.sunstone) { // && pkg.sunstone.type === 'plugin') {
        let pkgPath = filepath.replace('package.json', '')
        let mainModule = path.join(pkgPath, pkg.main)

        // TODO
        // handle case where mainModule is not an extension of AbstractPlugin
        require(mainModule).register(pkg, this)
        registered.add(filepath)
      }

      unregistered.delete(filepath)
    })
  }

  /**
   * resolve
   */
  resolve () {
    let plugins = this[PLUGINS]

    debug('resolving plugin dependencies')
    return Promise.all(
      Object.keys(plugins).map(name => {
        return plugins[name].resolve()
      })
    )
  }

  /**
   * prioritize
   */
  prioritize () {
    debug('prioritizing plugins by satisfied dependencies')
    let plugins = this[PLUGINS]
    let ordered = []
    let remaining = _.values(plugins)

    while (remaining.length > 0) {
      remaining.forEach((plugin, index) => {
        let dependencies = _.values(plugin.dependencies)

        let isSatisfied = dependencies.every(dependency => {
          return ordered.includes(dependency)
        })

        if (isSatisfied) {
          ordered.push(plugin)
          remaining.splice(index, 1)
        }
      })
    }

    this.prioritized = ordered
  }

  /**
   * initialize
   */
  initialize () {
    let { prioritized } = this

    debug('initializing plugin components')
    prioritized.forEach(plugin => plugin.initialize())
  }

  /**
   * Lifecycle methods
   */

  /**
   * start
   */
  start () {
    let plugins = this[PLUGINS]

    debug('starting plugins')
    Object.keys(plugins).forEach(key => {
      debug('starting "%s"', key)
      plugins[key].start()
    })
  }

  /**
   * stop
   */
  stop () {}

  /**
   * accessors
   */
  get plugins () {
    return this[PLUGINS]
  }

  get injector () {
    return this[INJECTOR]
  }

  get application () {
    return this[APPLICATION]
  }

  get registered () {
    return this[REGISTERED]
  }

  get unregistered () {
    return this[UNREGISTERED]
  }

}

/**
 * Export
 */
module.exports = PluginRegistry



