const Post = require('./../models/Post')
const Tag = require('./../models/Tag')
const url = require('url')

module.exports = {  
	addPost : (req, res, next) => {		
		const savepost = req.body;
		const post = new Post(savepost); 
		if(!savepost._id){
			post.save((err, newpost) => {
				if(err)
					res.send(err)
				else if(!newpost)
					res.send(400)
				else
					res.send(newpost)
				next()
			});
		}else{
			Post.findById(req.body._id, function(err, post){ 
				if(err) return handleError(err);	
				post.set(savepost);		
				post.save((err, updatePost) => {
					if(err)
						res.send(err)
					else if(!updatePost)
						res.send(400)
					else
						res.send(updatePost)
					next()
				});

			});
		}
	},
	getPost : (req, res, next) => {
		const postid = req.params.id;
		Post.findById(postid)
			.populate('tags').populate('author').populate({path:'comments.author', select:'name'})
			.exec((err, post)=> {  
            if (err)
                res.send(err)
            else if (!post)
                res.send(404)
            else
                res.send(post)
            next()            
        })
	},
	savecomment : (req, res, next) => {
		const request = req.body;
		const id = request.id;		
		Post.findById(id).exec((err, post) => {
			if(err){ res.send(err) }
			post.comment({author: request.author, text: request.text}).then((savedcomment)=>{
				return res.send({result: true, data : savedcomment})
			})
		});
	},
	getAllPost : (req, res, next) => {
		const filter = {};
		const query = url.parse(req.url,true).query;
		if(query.author){
			filter.author = query.author;
		}
		if(query.keyword){
			const keyword = new RegExp(query.keyword, 'i');         
			filter.$or = [{title: keyword}, {description:keyword}]
		}
		if(query.tags){
			const tagsarr = query.tags.split(",");
			filter.tags = {$in : tagsarr};
		}
		var skip = 0;
		var limit = 0;
		if(query.page && query.limit){
			page = parseInt(query.page);
			limit = parseInt(query.limit);
			skip = (page*limit)-limit;
			limit = limit;
		}
		Post.find(filter).populate('author').populate('tags').sort({_id:-1}).skip(skip).limit(limit).exec((err, posts)=> {
            if (err)
                res.send(err)
            else if (!posts)
                res.send(404)
            else
                res.send(posts)
            next()            
        })
	},
	savePostAndTag : (req, res, next) => {
		const request = req.body
		const tags = request.tags.map(function(item, index){
			return { title : item }; 
		})
		
		Tag.insertMany(tags, {ordered:false}, function(err, savedtags){
			if(err){ 
				if(err.code=="11000"){
					Tag.find({ "title": { "$in" : request.tags }}).then(function(data){
						const post = new Post(request);
						post.tags = data.map(function(item, index){
							return item._id
						})
						post.save((err, savedpost) => {
							if(err){
								res.send(err);
							}else{
								res.send({post: savedpost, tags:data});
							}
						})
					})
				}else{
					res.send(err);
				}
			}else{
				const post = new Post(request);
				post.tags = savedtags.map(function(item, index){
					return item._id
				})
				post.save((err, savedpost) => {
					if(err){
						res.send(err);
					}else{
						res.send({post: savedpost, tags:savedtags});
					}
				})
			}
		})		
	},
	savePostAndTagAsync : async (req, res, next) => {
		const request = req.body;
		let returnres;
		if(request._id){
			const post = await Post.findById(request._id)
			returnres = await post.savePostTags(request);		
		}else{
			const post = new Post();		
			returnres = await post.savePostTags(request);
		}		
		res.send(returnres);
	},

	getAlltags : (req, res, next) => {
		Tag.aggregate([
            { "$project": {
                "value": "$_id",
                "label": "$title",
            }}
        ], function (err, tags) {
            if (err)
                res.send(err)
            else if (!tags)
                res.send(404)
            else
                res.send(tags)
            next()            
        });

	},	
	removepost : (req, res, next) => {
		const request = req.body
		Post.findByIdAndRemove(request._id, (err, post) => {
			if(err){
				res.send(err);
			}else{
				res.send({post: post, message:'deleted'});
			}
		});
	}
}