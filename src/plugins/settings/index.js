/**
 * Dependencies
 */
const AbstractPlugin = require('../../architecture/AbstractPlugin')

/**
 * SettingsPlugin
 */
class SettingsPlugin extends AbstractPlugin {

  /**
   * initialize
   */
  initialize () {

    this.require(['os', 'path', 'crypto'])

    this.require({
      'Settings': __dirname + '/Settings'
    })

    this.factory('settings', (Settings, os, path, crypto) => {
      let settings = new Settings({

        'host': {
          type: 'string',
          alias: 'h',
          default: 'localhost',
          describe: 'Host of the server process'
        },

        'port': {
          alias: 'p',
          default: 3000,
          describe: 'Port of the server process',
          type: 'number'
        },

        'data': {
          alias: 'd',
          default: 'data',
          describe: 'Path to locally persisted data'
        },

        'max-processes': {
          alias: 'm',
          default: os.cpus().length,
          describe: 'Maximum number of workers',
          type: 'number'
        },

        'https-cert': {
          type: 'string',
          default: path.join('certs', 'sunstone.crt'),
          describe: 'Path to SSL Certificate'
        },

        'https-key': {
          type: 'string',
          default: path.join('certs', 'sunstone.key'),
          describe: 'Path to SSL Private Key'
        },

        'http-only': {
          type: 'boolean',
          default: false,
          describe: 'Run the server without SSL'
        },

        'cookie-secret': {
          type: 'string',
          default: crypto.randomBytes(10).toString('hex'),
          describe: 'Session key entropy'
        },

        'log-level': {
          default: 'info',
          describe: 'Log level'
        }
      })

      // ensure generated values are consistent across process forks
      process.env.SUNSTONE_COOKIE_SECRET = settings['cookie-secret']

      let { host, port, 'http-only': http } = settings
      let scheme = http ? 'http' : 'https'
      let issuer = `${scheme}://${host}`

      if (port !== 443 && port !== 80) {
        issuer += `:${port}`
      }

      settings.issuer = issuer

      return settings
    })
  }

}

/**
 * Export
 */
module.exports = SettingsPlugin
