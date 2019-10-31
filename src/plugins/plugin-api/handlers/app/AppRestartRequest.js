/**
 * Dependencies
 */

/**
 * AppRestartRequest
 */
class AppRestartRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/app/restart'
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
module.exports = AppRestartRequest
