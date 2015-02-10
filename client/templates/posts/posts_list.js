/**
 * Created by kalinzstoev on 03/02/15.
 */

    //returns all the posts from the browser database
Template.postsList.helpers({
    posts: function ()
    {
        return Posts.find();
    }
});
