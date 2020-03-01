const authController = require('./../controllers/AuthController')

module.exports = (router) => {
        router
                .route('/auth/login').post(authController.loginAttempt)

        router
                .route('/auth/user').get(authController.checkToken)
}
