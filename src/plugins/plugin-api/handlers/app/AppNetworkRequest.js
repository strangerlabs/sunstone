/**
 * Dependencies
 */

/**
 * AppNetworkRequest
 */
class AppNetworkRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/app/network'
    }
  }

  static handle (req, res, service) {
    res.json({
      // ...
    })
  }

}

/**
 * Export
 */
module.exports = AppNetworkRequest
