/* global module */

module.exports = function(db) {
    "use strict";

    var module = {};

    var users = require('./users/users')(db),
        comments = require('./comments/comments')(db),
        events = require('./events/events')(db),
        Promise = require('bluebird');

    module.idea = function idea(data) {
        if (data === null) {
            return new Promise(function(resolve) {
                resolve();
            });
        }

        var ideaAuthor = new Promise(function(resolve, reject) {
            users.get(data.authorId, function(err, ideaAuthorObj) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    data.author = ideaAuthorObj;
                    resolve(data);
                }
            });
        });

        var ideaEvent = new Promise(function(resolve, reject) {
            if (data.eventId === "") {
                resolve();
                return;
            }
            events.get(data.eventId, function(err, ideaEventObj) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    data.event = ideaEventObj;
                    resolve(data);
                }
            });
        });

        var ideaLikes = [];
        if (data.likes.length === 0) {
            ideaLikes.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaLikes = data.likes.map(function(like) {
                return new Promise(function(resolve, reject) {
                    users.get(like.userId, function(err, likeUserObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            like.user = likeUserObj;
                            resolve(like);
                        }
                    });
                });
            });
        }

        var ideaComments = [];
        if (data.comments.length === 0) {
            ideaComments.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaComments = data.comments.map(function(comment) {
                return new Promise(function(resolve, reject) {
                    comments.get(comment.commentId, function(err, commentObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            for (var attrName in commentObj) {
                                if (commentObj.hasOwnProperty(attrName)) {
                                    comment[attrName] = commentObj[attrName];
                                }
                            }
                            resolve(comment);
                        }
                    });
                });
            });
        }

        var ideaCommentAuthors = [];

        if (data.comments.length === 0) {
            ideaCommentAuthors.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaCommentAuthors = Promise.all(ideaComments).then(function() {
                ideaCommentAuthors = data.comments.map(function(comment) {
                    return new Promise(function(resolve, reject) {
                        users.get(comment.authorId, function(err, commentObj) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            else {
                                comment.author = commentObj;
                                resolve(comment);
                            }
                        });
                    });
                });
                return ideaCommentAuthors;
            }, function() {
                ideaCommentAuthors.push(new Promise(function(resolve, reject) {
                    reject();
                }));
                return ideaCommentAuthors;
            });
        }

        var ideaBacks = [];
        if (data.backs.length === 0) {
            ideaBacks.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaBacks = data.backs.map(function(back) {
                return new Promise(function(resolve, reject) {
                    users.get(back.authorId, function(err, backObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            back.author = backObj;
                            resolve(back);
                        }
                    });
                });
            });
        }

        var ideaTeam = [];
        if (data.team.length === 0) {
            ideaTeam.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaTeam = data.team.map(function(member) {
                return new Promise(function(resolve, reject) {
                    users.get(member.memberId, function(err, memberObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            member.member = memberObj;
                            resolve(member);
                        }
                    });
                });
            });
        }

        var ideaUpdates = [];
        if (data.updates.length === 0) {
            ideaUpdates.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaUpdates = data.updates.map(function(update) {
                return new Promise(function(resolve, reject) {
                    users.get(update.authorId, function(err, updateObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            update.author = updateObj;
                            resolve(update);
                        }
                    });
                });
            });
        }

        return Promise.all([
            ideaAuthor,
            ideaEvent,
            Promise.all(ideaLikes),
            Promise.all(ideaCommentAuthors),
            Promise.all(ideaBacks),
            Promise.all(ideaTeam),
            Promise.all(ideaUpdates)
        ]);
    };

    module.headers = function headers(data) {
        var ideaHeaders = [];

        if (data.length === 0) {
            ideaHeaders.push(new Promise(function(resolve) {
                resolve(null);
            }));
        }
        else {
            ideaHeaders = data.map(function(header) {
                return new Promise(function(resolve, reject) {
                    users.get(header.authorId, function(err, headerObj) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else {
                            header.author = headerObj;
                            resolve(header);
                        }
                    });
                });
            });
        }

        return Promise.all(ideaHeaders);
    };

    return module;
};
