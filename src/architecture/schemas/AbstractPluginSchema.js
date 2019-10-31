/**
 * Dependencies
 */
const LifecycleSchema = require('./LifecycleSchema')

/**
 * PluginSchema
 */
let AbstractPluginSchema = LifecycleSchema.extend({
  type: 'object',
  properties: {

    name: {
      type: 'string'
    },

    version: {
      type: 'string',
      // format: 'semver'
    },

    description: {
      type: 'string'
    },

    main: {
      type: 'string'
    },

    repository: {
      type: 'object'
    },

    author: {
      type: ['string', 'object']
    },

    contributors: {
      type: ['array'],
      items: {
        type: 'object'
      }
    },

    license: {
      type: 'string'
    },

    bugs: {
      type: 'string'
    },

    homepage: {
      type: 'string'
    },

    sunstone: {
      type: 'object',
      properties: {

        engine: {
          type: 'string',
          // format: 'semver'
          default: '>=0.0.0'
        },

        type: {
          type: 'string',
          enum: [
            'host',
            'extension',
            'plugin'
          ],
          default: 'plugin'
        },

        credentials: {
          type: [ 'object', 'string' ]
        },

        dependencies: {
          type: 'object',
          default: {}
        }

      },
      required: [
        'type'
      ]
    },

    policy: {
      type: 'string',
      enum: [
        'eager',
        'lazy'
      ],
      default: 'lazy'
    },

    auto: {
      type: 'boolean',
      default: false
    },

    mortal: {
      type: 'boolean',
      default: true
    },

    state: {
      type: 'string',
      enum: [
        'INITIALIZED',
        'ENABLED',
        'DISABLED',
        'STARTED',
        'STOPPED'
      ],
      default: 'INITIALIZED'
    }

  },
  required: [
    'name',
    'version',
    //'description',
    'main',
    //'author',
    //'license',
    'sunstone'
  ]
})

/**
 * Export
 */
module.exports = AbstractPluginSchema
