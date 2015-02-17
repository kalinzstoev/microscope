 Posts = new Mongo.Collection('posts');

 Posts.allow({
     update: function(userId, post) { return ownsDocument(userId, post); },
     remove: function(userId, post) { return ownsDocument(userId, post); }
 });

 Posts.deny({
     update: function(userId, post, fieldNames) {
         // may only edit the following two fields:
         return (_.without(fieldNames, 'url', 'title').length > 0);
     }
 });

Meteor.methods(
    {
    postInsert: function(postAttributes)
    {
        //checks if the user is logged in
        check(Meteor.userId(), String);

        //checks if title and url are strings from an object called postAttributes
        check(postAttributes,
            {
            title: String,
            url: String
        });

        var errors = validatePost(postAttributes);
        if (errors.title || errors.url)
            throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

        //checks if there is a post with the same link and returns a boolean value
        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }
        
        var user = Meteor.user();
        var post = _.extend(postAttributes,
            {
            userId: user._id,
            author: user.username,
                submitted: new Date(),
                commentsCount: 0
        });
        var postId = Posts.insert(post);
        return
        {
            _id: postId
        };
    }
});

 Meteor.methods({
     postUpdate : function (currentPostId, postProperties){

         //checks if title and url are strings from an object called postProperties
         check(postProperties,
             {
                 title: String,
                 url: String
             });

         var errors = validatePost(postAttributes);
         if (errors.title || errors.url)
             throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");

         //checks if there is a post with the same link and returns a boolean value
         var postWithSameLink = Posts.findOne({url: postProperties.url});
         if (postWithSameLink) {
             return {
                 postExists: true,
                 _id: postWithSameLink._id
             }
         }

         Posts.update(currentPostId, {$set: postProperties});

         return
             {
                currentPostId;
             };

         }
 });

 validatePost = function (post) {
     var errors = {};
     if (!post.title)
         errors.title = "Please fill in a headline";
     if (!post.url)
         errors.url =  "Please fill in a URL";
     return errors;
 }

