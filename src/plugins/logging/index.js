/**
 * Dependencies
 */
const AbstractPlugin = require('../../architecture/AbstractPlugin')

/**
 *
 */
class Logging extends AbstractPlugin {

  /**
   * initialize
   */
  initialize () {
    let plugin = this

    /**
     * npm dependencies
     */
    plugin.require('bunyan')

    /**
     * log
     */
    plugin.factory('log', (bunyan, settings) => {
      return bunyan.createLogger({
        name: plugin.application.name,
        level: settings['log-level']
      })
    })

    /**
     * requestLogger
     */
    plugin.factory('requestLogger', (log) => {

      return (req, res, next) => {
        let startTime = new Date();

        res.on('finish', () => {
          let { method, baseUrl, url, body } = req
          let { ip, headers, connection, socket } = req
          let { referer, referrer } = headers
          let { statusCode } = res

          let info = {
            'remote-address': ip,
            'method': method,
            'url': `${baseUrl || ''}${url || ''}`,
            'referer': referer || referrer || '-',
            'body': body,
            'response-time': new Date() - startTime,
            'status-code': statusCode,
            'req-headers': headers,
            'res-headers': res._headers
          }

          log.info({ res: info })
        })

        next()
      }
    })
  }

}

/**
 * Export
 */
module.exports = Logging
