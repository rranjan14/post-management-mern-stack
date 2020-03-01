const mongoose = require('mongoose')
const Tag = require('./Tag')

let PostSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [
            {
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                text: String
            }
        ],
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }]
    }
)
PostSchema.methods.savePostTags = async function (request) {
    const tags = request.tags.map(function (item, index) {
        return { title: item };
    })

    let savedtags
    try {
        savedtags = await Tag.insertMany(tags, { ordered: false });            
    } catch (err) {
        if (err.code == "11000") {
            savedtags = await Tag.find({ "title": { "$in": request.tags } });
        } else {
            return err;
        }
    }
    let savedpost
    try {
        this.set(request);
        this.tags = savedtags.map(function (item, index) {
            return item._id
        })
        savedpost = await this.save();
    } catch (err) {
        return err;
    }
    return { post: savedpost, tags: savedtags };
}

PostSchema.methods.comment = function (c) {
    this.comments.push(c);
    return this.save();
}

module.exports = mongoose.model('Post', PostSchema)