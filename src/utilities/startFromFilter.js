/* global angular */

angular.module('flintAndSteel')
.filter('startFrom',
    [
        function() {
            "use strict";

            return function(input, start) {
                if (Array.isArray(input) === false) {
                    throw new TypeError("arg0 is not valid! Expected array");
                }

                var parsedStart = +start; //parse to int

                // Ensure parsedStart is an integer
                if (typeof parsedStart !== 'number' || !isFinite(parsedStart) || Math.floor(parsedStart) !== parsedStart) {
                    throw new TypeError("arg1 is not valid! Expected to be parsable to an integer");
                }

                return input.slice(parsedStart);
            };
        }
    ]
);
