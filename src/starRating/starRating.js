/* global angular */

angular.module('flintAndSteel')
.directive('starRating',
    [
        function() {
            "use strict";

            return {
                restrict: 'E',
                scope: {
                    idea: '=',
                    ratingValue: '=ngModel'
                },
                templateUrl: 'starRating/starRating.tpl.html',
                controller: 'StarRatingCtrl',
                link: function (scope, elem, attrs) {
                }
            };
        }
    ]
);
