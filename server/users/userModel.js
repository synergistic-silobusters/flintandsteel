/* global exports */
/* global process */

function User(firstName, lastName, fullName, username, email, nickname, title) {
    "use strict";

    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = fullName;
    this.username = username;
    this.email = email;
    this.nickname = nickname;
    this.title = title;

    return this;
}

function UserLDAP(ldapObj) {
    "use strict";

    if (typeof ldapObj._json === "undefined") {
        throw "Invalid LDAP Object";
    }

    var ldapJson = ldapObj._json;

    this.firstName = ldapJson.givenName;
    this.lastName = ldapJson.sn;
    this.fullName = ldapJson.displayName;
    this.username = ldapJson.sAMAccountName;
    this.email = ldapJson.mail;
    this.nickname = ldapJson.cn;
    this.title = ldapJson.title;

    return this;
}

var createFn;

if (process.env.NODE_ENV === 'production') {
    createFn = function(ldapObj) {
        "use strict";

        return new UserLDAP(ldapObj);
    };
}
else {
    createFn = function(firstName, lastName, fullName, username, email, nickname, title) {
        "use strict";

        return new User(firstName, lastName, fullName, username, email, nickname, title);
    };
}

exports.create = createFn;
