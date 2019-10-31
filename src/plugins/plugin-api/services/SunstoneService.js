/**
 * Dependencies
 */
const HTTPService = require('../../../http/HTTPService')
const _ = require('lodash')
const handlers = _.values(require('../handlers'))

/**
 * SunstoneService
 */
class SunstoneService extends HTTPService {

  get handlers () {
    return handlers
  }

}

/**
 * Export
 */
module.exports = SunstoneService
