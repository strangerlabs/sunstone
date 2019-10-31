'use strict'

/**
 * Dependencies
 */
const settings = require('./settings') // should be the very first require
const server = require('./server')
const cluster = require('cluster')

/**
 * TODO
 *
 * 1. generate self-signed or letsencrypt once before forking, if needed,
 *    based on localhost or other domain
 */

/**
 * Start the server with multiple workers
 */
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // spawn workers
  for (let i = 0; i < settings['max-processes']; i++) {
    cluster.fork()
  }
} else {
  server.start()
}
