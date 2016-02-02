
angular.module('flintAndSteel')
.controller('StarRatingCtrl',
    [
        '$scope',
        function($scope) {
            "use strict";

            var ctrl = this;

            $scope.rating = 0;
            $scope.maxStars = 5;

            function updateStars() {
                $scope.stars = [];
                for (var i = 0; i < $scope.maxStars; i++) {
                    $scope.stars.push({
                        filled: i < $scope.ratingValue
                    });
                }
            };

            updateStars();

            $scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });

            $scope.toggle = function (index) {
                $scope.ratingValue = index + 1;
                /*$scope.onRatingSelected({
                    rating: index + 1
                });*/
            };

            ////////////////////////
            // HAS USER FUNCTIONS //
            ////////////////////////
            ctrl.hasUserRatedValue = function hasUserRatedValue() {
                var hasUserRatedValue = false;
                if (userSvc.isUserLoggedIn() && typeof $scope.idea.ratings.value !== 'undefined') {
                    $scope.idea.ratings.value.forEach(function(value) {
                        if (userSvc.getProperty('_id') === value.authorId) {
                            hasUserRatedValue = true;
                        }
                    });
                }
                return hasUserRatedValue;
            };

            ctrl.hasUserRatedComplexity = function hasUserRatedComplexity() {
                var hasUserRatedComplexity = false;
                if (userSvc.isUserLoggedIn() && typeof $scope.idea.ratings.complexity !== 'undefined') {
                    $scope.idea.ratings.complexity.forEach(function(complexity) {
                        if (userSvc.getProperty('_id') === complexity.authorId) {
                            hasUserRatedComplexity = true;
                        }
                    });
                }
                return hasUserRatedComplexity;
            };
        }
    ]
)
