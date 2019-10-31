/**
 * Dependencies
 */
const { JSONSchema } = require('@trust/json-document')

/**
 * LifecycleSchema
 */
let LifecycleSchema = new JSONSchema({
  type: 'object',
  properties: {
    uuid: {
      type: 'string',
      //format: 'uuid'
    },
    name: {
      type: 'string'
    },
    version: {
      type: 'string'
    },
    storage: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        adapter: { type: 'object' }
      }
    },
    state: {
      type: 'string',
      enum: [
        'INSTALLED',
        'ACTIVE'
      ],
      default: 'INITIALIZED'
    }
  }
})

/**
 * Export
 */
module.exports = LifecycleSchema
