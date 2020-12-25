module.exports = class ExpressRouterAdapter {
  static bodyAdapt (router) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }

      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }

  static queryStringAdapt (router) {
    return async (req, res) => {
      const httpRequest = {
        query: req.query
      }

      const httpResponse = await router.route(httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
