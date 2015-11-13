/* global exports */

function User(firstName, lastName, fullName, username, email, nickname, title) {
    "use strict";

    this.firstName = firstName,
    this.lastName = lastName,
    this.fullName = fullName,
    this.username = username,
    this.email = email,
    this.nickname = nickname,
    this.title = title,
    this.likedIdeas = []

    return this;
}

// NOTE: remember to pass in "user._json", not just "user"
function UserLDAP(ldapObj) {
    "use strict";

    this.firstName = ldapObj.givenName,
    this.lastName = ldapObj.sn,
    this.fullName = ldapObj.displayName,
    this.username = ldapObj.sAMAccountName,
    this.email = ldapObj.mail,
    this.nickname = ldapObj.cn,
    this.title = ldapObj.title,
    this.likedIdeas = []

    return this;
}

var createFn;

if (process.env.NODE_ENV === 'production') {
    createFn = function(ldapObj) {
        "use strict";

        return new UserLDAP(ldapObj);
    }
}
else {
    createFn = function(firstName, lastName, fullName, username, email, nickname, title) {
        "use strict";

        return new User(firstName, lastName, fullName, username, email, nickname, title);
    }
}

exports.create = createFn;
