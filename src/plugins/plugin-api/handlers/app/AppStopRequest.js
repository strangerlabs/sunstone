/**
 * Dependencies
 */

/**
 * AppStopRequest
 */
class AppStopRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/app/stop'
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
module.exports = AppStopRequest
