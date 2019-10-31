/**
 * Dependencies
 */
const HTTPService = require('../../http/HTTPService')
const AlphaRequest = require('./handlers/AlphaRequest')
const BravoRequest = require('./handlers/BravoRequest')

/**
 * MyService
 */
class MyService extends HTTPService {

  get handlers () {
    return [
      AlphaRequest,
      BravoRequest
    ]
  }

}

/**
 * Export
 */
module.exports = MyService
