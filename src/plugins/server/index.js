/**
 * Dependencies
 */
const https = require('https')
const AbstractPlugin = require('../../architecture/AbstractPlugin')

/**
 * ServerPlugin
 */
class ServerPlugin extends AbstractPlugin {

  /**
   * initialize
   */
  initialize () {
    let plugin = this

    // package dependencies
    plugin.require('express')
    plugin.require({ bodyParser: 'body-parser' })

    // main server
    plugin.factory('server', () => {
      let express = this.component('express')
      let logger = this.component('requestLogger')
      let parser = this.component('bodyParser')

      // create server
      let server = express()

      // remove header
      server.disable('x-powered-by')

      // mount base middleware
      server.use(logger)
      server.use(parser.json())

      return server
    })

    // method for registering router components
    plugin.assembler('router', () => {
      let { injector } = this
      return (name, fn) => {
        let type = 'router'
        injector.register({ name, type, plugin, fn })
      }
    })
  }

  /**
   * Listening (helper method)
   */
  listening () {
    return () => {
      let log = this.component('log')
      let settings = this.component('settings')
      let { host, port, 'http-only': http } = settings
      let { pid } = process
      let schema = http ? 'http' : 'https'

      log.info(`Listener ${pid} started at ${schema}://${host}:${port}`)
    }
  }

  /**
   * start
   */
  start () {
    let cert = this.component('cert')
    let key = this.component('key')
    let server = this.component('server')
    let settings = this.component('settings')
    let { port, 'http-only': http } = settings
    console.log('##', port)
    if (http) {
      server.listen(port, this.listening())
    } else {
      https
        .createServer({ key, cert }, server)
        .listen(port, this.listening())
    }
  }

}

/**
 * Export
 */
module.exports = ServerPlugin
