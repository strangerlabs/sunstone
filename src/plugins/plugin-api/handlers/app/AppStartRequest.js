/**
 * Dependencies
 */

/**
 * AppStartRequest
 */
class AppStartRequest {

  static get route () {
    return {
      method: 'POST',
      path: '/sunstone/v1/app/start'
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
module.exports = AppStartRequest
