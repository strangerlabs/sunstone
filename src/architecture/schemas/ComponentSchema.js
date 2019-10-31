/**
 * Dependencies
 */
const { JSONSchema } = require('@trust/json-document')

/**
 * ComponentSchema
 */
let ComponentSchema = new JSONSchema({
  properties: {
    name: { type: 'string' },
    type: { type: 'string' },
    //plugin: {type: 'object' },
    // these need special validation functions
    fn: {},
    value: {},

    // here or accessor?
    dependencies: { type: 'array' }
  },
  required: [
    'name',
    'type',
    'plugin'
  ]
})

/**
 * Export
 */
module.exports = ComponentSchema
