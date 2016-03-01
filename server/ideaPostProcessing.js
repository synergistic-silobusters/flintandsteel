/* global module */

module.exports = function(db) {
    "use strict";

    var module = {};

    var users = require('./users/users')(db),
        comments = require('./comments/comments')(db),
        events = require('./events/events')(db),
        Promise = require('bluebird');

    module.idea = function idea(data) {
        if (!data) {
            return new Promise(function(resolve) {
                resolve();
            });
        }

        var ideaAuthor = new Promise(function(resolve, reject) {
            users.get(data.authorId).then(function(ideaAuthorObj) {
                data.author = ideaAuthorObj;
                resolve(data);
            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });

        var ideaEvent = new Promise(function(resolve, reject) {
            if (data.eventId === "") {
                resolve();
                return;
            }
            events.get(data.eventId).then(function(ideaEventObj) {
                data.event = ideaEventObj;
                resolve(data);
            }).catch(function(err) {
                console.log(err);
                reject(err);
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
                    users.get(like.userId).then(function(likeUserObj) {
                        like.user = likeUserObj;
                        resolve(like);
                    }).catch(function(error) {
                        console.log(error);
                        reject(error);
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
                    comments.get(comment.commentId).then(function(commentObj) {
                        for (var attrName in commentObj) {
                            if (commentObj.hasOwnProperty(attrName)) {
                                if (attrName === '_id') {
                                    continue;
                                }
                                comment[attrName] = commentObj[attrName];
                            }
                        }
                        resolve(comment);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
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
                        users.get(comment.authorId).then(function(commentObj) {
                            comment.author = commentObj;
                            resolve(comment);
                        }).catch(function(error) {
                            console.log(error);
                            reject(error);
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
                    users.get(back.authorId).then(function(backObj) {
                        back.author = backObj;
                        resolve(back);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
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
                    users.get(member.memberId).then(function(memberObj) {
                        member.member = memberObj;
                        resolve(member);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
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
                    users.get(update.authorId).then(function(updateObj) {
                        update.author = updateObj;
                        resolve(update);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
                    });
                });
            });
        }

        // Calculate the average Value rating
        var theDatabase = db.getDb();
        var ideaAvgComplexity = new Promise(function(resolve, reject) {
            theDatabase.collection('ideas').aggregate([
                { $match: {_id: data._id} },
                { $unwind: "$complexity" },
                { $group: {_id: null, ratingAvg: { $avg: '$complexity.value'} } }
            ]).toArray().then(function(averages) {
                //If no ratings, average to zero
                if (typeof averages[0] === 'undefined') {
                    data.avgComplexity = {
                        value: Number(0).toFixed(2),
                        stars: []
                    };
                }
                //If ratings, average to 2 decimals
                else {
                    data.avgComplexity = {
                        value: Number(averages[0].ratingAvg).toFixed(2),
                        stars: []
                    };
                }
                //load star values to update page
                for (var i = 0; i < 5; i++) {
                    data.avgComplexity.stars.push({ filled: i < data.avgComplexity.value });
                }
                resolve(data);
            }).catch(function(err) {
                console.log(err);
                reject(err);
            });
        });

        return Promise.all([
            ideaAuthor,
            ideaEvent,
            Promise.all(ideaLikes),
            Promise.all(ideaCommentAuthors),
            Promise.all(ideaBacks),
            Promise.all(ideaTeam),
            Promise.all(ideaUpdates),
            ideaAvgComplexity
        ]);
    };

    module.headers = function headers(data) {
        var ideaHeaders = [];

        if (data.length === 0) {
            ideaHeaders.push(new Promise(function(resolve) {
                resolve();
            }));
        }
        else {
            ideaHeaders = data.map(function(header) {
                var ideaAuthor = new Promise(function(resolve, reject) {
                    users.get(header.authorId).then(function(headerObj) {
                        header.author = headerObj;
                        resolve(header);
                    }).catch(function(error) {
                        console.log(error);
                        reject(error);
                    });
                });

                var ideaEvent = new Promise(function(resolve, reject) {
                    if (header.eventId === "") {
                        resolve();
                        return;
                    }
                    events.get(header.eventId).then(function(ideaEventObj) {
                        header.event = ideaEventObj;
                        resolve(header);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
                    });
                });

                return Promise.all([
                    ideaAuthor,
                    ideaEvent
                ]);
            });
        }

        return Promise.all(ideaHeaders);
    };

    return module;
};
