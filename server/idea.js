/* global exports */

function Idea(title, description, authorId, likes, comments, backs) {
    "use strict";



    this.title = title;
    this.description = description;
    this.authorId = authorId;
    this.likes = likes;
    this.comments = comments;
    this.backs = backs;
    this.backs.push({
        text: "Idea Owner",
        authorId: this.authorId,
        time: new Date().toISOString(),
        types: [{name: "Owner", _lowername: "owner"}]
    }];
    this.team = [{memberId: this.authorId}];

    return this;
}

exports.create = function(title, description, authorId, likes, comments, backs) {
    "use strict";

    return new Idea(title, description, authorId, likes, comments, backs);
};
