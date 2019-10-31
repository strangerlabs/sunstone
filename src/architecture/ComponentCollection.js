'use strict'

/**
 * Dependencies
 * @ignore
 */
const _ = require('lodash')
const Collection = require('./Collection')

/**
 * ComponentCollection
 */
class ComponentCollection extends Collection {

  /**
   * Values
   *
   * @description
   * Iterate through current contents of the collection and return the
   * relative instances from the injector.
   *
   * @returns {Array}
   */
  values () {
    return this.map(component => {
      let { name, injector } = component
      return injector.get(name)
    })
  }
}

/**
 * Exports
 */
module.exports = ComponentCollection
