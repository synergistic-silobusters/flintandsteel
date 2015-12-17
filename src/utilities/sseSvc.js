/* global angular */
/* global EventSource */

angular.module('flintAndSteel')
.factory('sseSvc',
    [
        function() {
            "use strict";

            var svc = this;

            var EV;
            svc.create = function create(eventName, eventLoc, callback) {
                EV = new EventSource(eventLoc);
                EV.addEventListener(eventName, function(event) {
                    var data = JSON.parse(event.data);
                    callback(data);
                });
            };

            svc.destroy = function destroy() {
                EV.close();
            };

            return {
                create: svc.create,
                destroy: svc.destroy
            };
        }
    ]
);
