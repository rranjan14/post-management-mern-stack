var JwtAuthMiddleware = require("./../Middlewares/JwtAuthMiddleware")
const usercontroller = require('./../controllers/UserController')

module.exports = (router) => {


    router
        .route('/user/:id')
        .get(JwtAuthMiddleware, usercontroller.getUser)


    router
        .route('/user')  
        .post(usercontroller.addUser)


	router
        .route('/users/')
        .get(JwtAuthMiddleware, usercontroller.getAllUsers)
}