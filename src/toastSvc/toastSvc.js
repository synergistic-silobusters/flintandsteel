/* global angular */

angular.module('flintAndSteel')
.factory('toastSvc',
    [
        '$mdToast',
        function($mdToast) {
            "use strict";

            var svc = this;

            svc.DURATION_LONG = 3000;
            svc.DURATION_SHORT = 1000;

            svc.show = function(message, options) {
                var position, duration;

                if (!options) {
                    position = 'top right';
                    duration = svc.DURATION_LONG;
                }
                else {
                    position = options.position || 'top right';
                    duration = options.duration || svc.DURATION_LONG;
                }

                return $mdToast.show(
                    $mdToast.simple()
                    .content(message)
                    .position(position)
                    .hideDelay(duration)
                    .action('OK')
                );
            };

            return {
                TOAST_DURATION_LONG: svc.DURATION_LONG,
                TOAST_DURATION_SHORT: svc.DURATION_SHORT,
                show: svc.show
            };
        }
    ]
);