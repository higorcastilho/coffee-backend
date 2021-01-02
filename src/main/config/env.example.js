module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/coffee-api',
  tokenSecret: process.env.TOKEN_SECRET || 'secret',
  port: process.env.PORT || 5858,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key', // your stripe secrect key string here e.g: sk_test_59a5sd95as5sghg8sasd599a
  frontendDomain: process.env.FRONT_END_DOMAIN || 'http://localhost:3001/checkout' // end point to redirect to successful purchase page
}
