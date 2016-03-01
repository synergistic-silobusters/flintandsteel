/* global exports */

function Event(name, location, startDate, endDate) {
    "use strict";

    this.name = name;
    this.location = location;
    this.startDate = startDate;
    this.endDate = endDate;

    return this;
}

exports.create = function(name, location, startDate, endDate) {
    "use strict";

    return new Event(name, location, startDate, endDate);
};
