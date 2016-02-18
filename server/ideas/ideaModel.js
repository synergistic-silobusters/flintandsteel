/* global exports */

function Idea(title, description, authorId, eventId, tags, rolesreq) {
    "use strict";

    var now = new Date().toISOString();

    if (!title) {
        throw new TypeError("Invalid title");
    }
    if (!description) {
        throw new TypeError("Invalid description");
    }
    if (!authorId) {
        throw new TypeError("Invalid authorId");
    }
    if (eventId === null || typeof eventId === 'undefined') {
        throw new TypeError("Invalid eventId");
    }
    if (!tags) {
        throw new TypeError("Invalid tags");
    }
    if (!rolesreq) {
        throw new TypeError("Invalid rolesreq");
    }

    this.title = title;
    this.description = description;
    this.authorId = authorId;
    this.eventId = eventId;
    this.timeCreated = now;
    this.timeModified = now;
    this.tags = tags;
    this.rolesreq = rolesreq;
    this.likes = [];
    this.updates = [];
    this.comments = [];
    this.backs = [{
        text: "Idea Owner",
        authorId: this.authorId,
        timeCreated: new Date().toISOString(),
        timeModified: '',
        types: [{name: "Owner", _lowername: "owner"}]
    }];
    this.team = [{memberId: this.authorId}];

    return this;
}

exports.create = function(title, description, authorId, eventId, tags, rolesreq) {
    "use strict";

    try {
        return new Idea(title, description, authorId, eventId, tags, rolesreq);
    }
    catch (e) {
        return e;
    }
};
