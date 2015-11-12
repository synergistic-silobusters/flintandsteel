/* global exports */

function Idea(title, description, author, likes, comments, backs) {
    "use strict";



    this.title = title;
    this.description = description;
    this.author = author;
    this.likes = likes;
    this.comments = comments;
    this.backs = backs;
    this.backs.push({
        text: "Idea Owner",
        from: this.author,
        time: new Date(),
        types: [{name: "Owner", _lowername: "owner"}]
    });
    this.team = [this.author];

    return this;
}

exports.create = function(title, description, author, likes, comments, backs) {
    "use strict";

    return new Idea(title, description, author, likes, comments, backs);
};
