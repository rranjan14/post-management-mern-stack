const postcontroller = require('./../controllers/PostController')

module.exports = (router) => {
    router
        .route('/post/:id')  
        .get(postcontroller.getPost)

    router
        .route('/post') 
        .post(postcontroller.addPost)

    router
        .route('/posttag') 
        .post(postcontroller.savePostAndTagAsync)


	router
        .route('/posts/')  
        .get(postcontroller.getAllPost)    

    router
        .route('/removepost')
        .post(postcontroller.removepost)

    router
        .route('/savecomment')
        .post(postcontroller.savecomment)
}
