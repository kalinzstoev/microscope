/**
 * Created by kalinzstoev on 05/02/15.
 */
Meteor.publish('posts', function() {
    return Posts.find();
});