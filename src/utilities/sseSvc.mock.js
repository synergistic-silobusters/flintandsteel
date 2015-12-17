/* global angular */

angular.module('flintAndSteel')
.factory('sseSvcMock',
    [
        function() {
            "use strict";

            var svc = this;

            var cb;

            svc.isActive = false;
            svc.simulate = function simulate() {
                cb(null);
            };

            svc.create = function create(eventName, eventLoc, callback) {
                svc.isActive = true;
                cb = callback;
            };

            svc.destroy = function destroy() {
                svc.isActive = false;
            };

            return {
                create: svc.create,
                destroy: svc.destroy,
                simulate: svc.simulate,
                isActive: function() {
                    return svc.isActive;
                }
            };
        }
    ]
);
