/* global angular */

angular.module('flintAndSteel')
.factory('sseSvcMock',
    [
        function() {
            "use strict";

            var svc = this;

            var cb;

            svc.isActive = false;
            svc.simulate = function simulate(idea) {
                cb(idea);
            };

            svc.subscribe = function create(eventName, eventLoc, callback) {
                svc.isActive = true;
                cb = callback;
            };

            svc.unsubscribe = function destroy() {
                svc.isActive = false;
            };

            return {
                subscribe: svc.subscribe,
                unsubscribe: svc.unsubscribe,
                simulate: svc.simulate,
                isActive: function() {
                    return svc.isActive;
                }
            };
        }
    ]
);
