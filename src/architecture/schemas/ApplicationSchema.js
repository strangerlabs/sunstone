/**
 * Dependencies
 */
const LifecycleSchema = require('./LifecycleSchema')

/**
 * ApplicationSchema
 */
let ApplicationSchema = LifecycleSchema.extend({
  properties: {
    name: {
      type: 'string'
    },
    version: {
      type: 'string'
    },
    basePaths: {
      type: 'array',
      default: [process.cwd()]
    },
    directories: {
      type: 'array',
      default: ['node_modules', 'plugins']
    },
    state: {
      type: 'string',
      enum: [
        'INITIALIZED',
        'STARTING',
        'STARTED',
        'STOPPING',
        'STOPPED',
        'RESTARTING'
      ],
      default: 'INITIALIZED'
    }

  }
})

/**
 * Export
 */
module.exports = ApplicationSchema
