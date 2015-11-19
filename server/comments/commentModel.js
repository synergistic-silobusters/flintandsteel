/* global exports */

function Comment(parentId, text, authorId) {
    "use strict";

    var now = new Date().toISOString();

    this.parentId = parentId;
    this.text = text;
    this.authorId = authorId;
    this.timeCreated = now;
    this.timeModified = now;

    return this;
}

exports.create = function(parentId, text, authorId) {
    "use strict";

    return new Comment(parentId, text, authorId);
};
