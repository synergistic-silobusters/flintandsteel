
angular.module('flintAndSteel')
.controller('StarRatingCtrl',
    [
        '$scope',
        function($scope) {
            "use strict";

            $scope.rating = 0;
            $scope.ratingValue = $scope.stars;

            function updateStars() {
                if($scope.maxStars == undefined) {
                    $scope.maxStars = 5;
                }
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
        }
    ]
)
