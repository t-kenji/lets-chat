//
// Notifications Controller
//

'use strict';

var settings = require('./../config');

module.exports = function() {

    var app = this.app,
        core = this.core,
        middlewares = this.middlewares;

    app.get('/notifications', middlewares.requireLogin, function(req) {
        req.io.route('notifications:settings');
    });

    app.post('/notifications/mentionedonly', middlewares.requireLogin, function(req) {
        req.io.route('notifications:mentionedOnly');
    });

    //
    // Sockets
    //
    app.io.route('notifications', {
        'settings': function(req, res) {
            var enabled = settings.notifications.mentionedOnly&& req.user.notificationsMentionedOnly;
            res.json({
                mentionedOnly: enabled
            });
        },
        'mentionedOnly': function(req, res) {
            core.account.update(req.user._id, { notificationsMentionedOnly: !req.user.notificationsMentionedOnly }, function(err) {
                if (err) {
                    res.json({
                        status: 'error',
                        message: err
                    });
                }
                res.json({
                    status: 'success'
                });
            });
        }
    });
};
