 Posts = new Mongo.Collection('posts');
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

        if (Meteor.isServer) {
            postAttributes.title += "(server)";
            // wait for 5 seconds
            Meteor._sleepForMs(5000);
        } else {
            postAttributes.title += "(client)";
        }


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
            submitted: new Date()
        });
        var postId = Posts.insert(post);
        return
        {
            _id: postId
        };
    }
});