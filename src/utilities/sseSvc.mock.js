/* global angular */

angular.module('flintAndSteel')
.factory('sseSvcMock',
    [
        function() {
            "use strict";

            var svc = this;

            svc.create = function create(eventName, eventLoc, callback) {
            };

            svc.destroy = function destroy() {
            };

            return {
                create: svc.create,
                destroy: svc.destroy
            };
        }
    ]
);
