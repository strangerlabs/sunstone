/**
 * Dependencies
 */
const _ = require('lodash')
const debug = require('debug')('sunstone:injector')
const Component = require('./Component')
const ComponentCollection = require('./ComponentCollection')

/**
 * Symbols
 */
const COMPONENTS = Symbol()
const REGISTRY = Symbol()

/**
 * ComponentInjector
 */
class ComponentInjector {

  /**
   * constructor
   */
  constructor (registry) {
    this[REGISTRY] = registry
    this[COMPONENTS] = {
      injector: Component.create({
        name: 'injector',
        value: this
      }),
      registry: Component.create({
        name: 'registry',
        value: registry
      })
    }
  }

  /**
   * create
   */
  static create (registry) {
    debug('creating injector')
    return new ComponentInjector(registry)
  }

  /**
   * register
   */
  register (descriptor) {
    debug('registering "%s"', descriptor.name)

    let component = Component.create(descriptor)
    let validation = component.validate()

    if (!validation.valid) {
      // Handle error
      return validation
    }

    component.extractDependencies()
    this[COMPONENTS][component.name] = component

    debug('registered "%s"', component.name)
  }

  /**
   * get
   */
  get (name, subject) { // subject is a plugin object or other subject credential
    let component = this[COMPONENTS][name]

    if (!component) {
      throw new Error(`Unknown component "${name}"`)
    }

    let { value } = component

    if (!value) {
      let values = []
      let fn = component.fn

      component.dependencies.forEach(dependency => {
        values.push(this.get(dependency, subject))
      })

      value = component.value = fn.apply(null, values)
    }

    debug('injecting "%s"', name)

    return value
  }

  /**
   * filter
   */
  filter (predicate) {
    let collection = new ComponentCollection(this[COMPONENTS])
    return collection.filter(predicate)
  }

}

/**
 * Export
 */
module.exports = ComponentInjector



