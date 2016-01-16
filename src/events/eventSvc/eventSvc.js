/* global angular */

angular.module('flintAndSteel')
.factory('eventSvc',
    [
        '$http',
        function($http) {
            "use strict";

            this.getEvents = function getEvents() {
                return $http.get('/events');
            };

            return {
                getEvents: this.getEvents
            };
        }
    ]
);
