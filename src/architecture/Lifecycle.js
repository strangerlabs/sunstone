/**
 * Dependencies
 */
const uuid = require('uuid')
const { JSONSchema } = require('@trust/json-document')

/**
 * Lifecycle
 *
 * Event-emitting schema validated hierarchical state machine
 * in the machine. Look out, this could get messy.
 */
class Lifecycle {

  /**
   * constructor
   */
  constructor (data, options) {
    let { constructor: { schema } } = this
    schema.initialize(this, Object.assign({ uuid: uuid.v4() }, data))
  }

  /**
   * schema
   */
  static get schema () {
    throw new Error(`Schema not defined for ${ this.name }`)
  }

  /**
   * lifecycle (state chart? transitions?)
   */
  static get lifecycle () {}

  /**
   * create
   */
  static create (data) {
    let ExtendedLifecycle = this
    return new ExtendedLifecycle(data)
  }

  /**
   * validate
   */
  validate () {
    let { constructor: { schema } } = this
    return schema.validate(this)
  }

  /**
   * lifecycle methods
   */
  install () {}
  initialize () {}
  start () {}
  update () {}
  upgrade () {}
  stop () {}
  remove () {}
}

/**
 * Export
 */
module.exports = Lifecycle
