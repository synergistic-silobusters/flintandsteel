/* global angular */

angular.module('flintAndSteel')
.factory('eventSvcMock',
    [
        "$q",
        function($q) {
            "use strict";

            var now = new Date();
            var events = [
                {
                    _id: 0,
                    name: "The On-Going Event!",
                    location: "Right Here",
                    startDate: now,
                    endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
                },
                {
                    _id: 1,
                    name: "Expired Event",
                    location: "Over There",
                    startDate: new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
                    endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
                }
            ];
            return {
                getEvents: function() {
                    return $q.when({ data: events });
                }
            };
        }
    ]
);
