const PostController = require('./../controllers/PostController')

module.exports = (router) => {
    router
        .route('/tags').get(PostController.getAlltags)
}
