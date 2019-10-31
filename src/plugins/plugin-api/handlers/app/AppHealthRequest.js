/**
 * Dependencies
 */

/**
 * AppHealthRequest
 */
class AppHealthRequest {

  static get route () {
    return {
      method: 'GET',
      path: '/sunstone/v1/app/health'
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
module.exports = AppHealthRequest
