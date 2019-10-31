/**
 * Dependencies
 */
const LifecycleSchema = require('./LifecycleSchema')

/**
 * PluginRegistrySchema
 */
let PluginRegistrySchema = LifecycleSchema.extend({
  properties: {
    basePaths: {
      type: 'array'
    },
    directories: {
      type: 'array'
    }
  }
})

/**
 * Export
 */
module.exports = PluginRegistrySchema
