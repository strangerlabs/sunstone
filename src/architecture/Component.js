/**
 * Dependencies
 */
const debug = require('debug')('sunstone:component')
const { JSONDocument } = require('@trust/json-document')
const { ComponentSchema } = require('./schemas')

/**
 * Symbols
 */
const DEPENDENCIES = Symbol()
const PLUGIN = Symbol()

/**
 * Constants
 * @ignore
 */
const ARROW_ARG = /^([^\(]+?)=>/
const FN_ARGS = /^[^\(]*\(\s*([^\)]*)\)/m
const FN_ARG_SPLIT = /,/
const FN_ARG = /^\s*(_?)(\S+?)\1\s*$/
const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg

/**
 * Component
 *
 * has plugin
 * has dependencies
 */
class Component extends JSONDocument {

  /**
   * constructor
   */
  constructor (data, plugin) {
    super(data)
    this[PLUGIN] = data.plugin
    this[DEPENDENCIES] = []
  }

  /**
   * schema
   */
  static get schema () {
    return ComponentSchema
  }

  /**
   * create
   */
  static create (data, plugin) {
    debug('creating "%s"', data.name)
    return new Component(data, plugin)
  }

  /**
   * Extract Dependencies
   * Adapted from AngularJS.
   * @private
   */
  static extractDependencies (fn) {
    let str = fn.toString().replace(STRIP_COMMENTS, '')
    let match = str.match(ARROW_ARG) || str.match(FN_ARGS)
    let args = match[1].split(FN_ARG_SPLIT)
    let result = args.map(str => str.trim())
    return result[0] !== '' ? result : []
  }

  /**
   * extractDependencies
   *
   * @description
   * Parse dependencies and store them as an array of dependency
   * names on this instance.
   *
   */
  extractDependencies () {
    if (this.fn && !this.dependencies) {
      this.dependencies = Component.extractDependencies(this.fn)
    }
  }

  /**
   * accessors
   */
  get plugin () {
    return this[PLUGIN]
  }

  get injector () {
    return this[PLUGIN].injector
  }

}

/**
 * Export
 */
module.exports = Component



