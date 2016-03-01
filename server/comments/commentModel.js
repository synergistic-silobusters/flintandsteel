/* global exports */

function Comment(parentId, text, authorId) {
    "use strict";

    var ObjectId = require('mongodb').ObjectId;

    var now = new Date().toISOString();

    this._id = new ObjectId();
    this.parentId = new ObjectId(parentId);
    this.text = text;
    this.authorId = new ObjectId(authorId);
    this.timeCreated = now;
    this.timeModified = now;

    return this;
}

exports.create = function(parentId, text, authorId) {
    "use strict";

    return new Comment(parentId, text, authorId);
};
