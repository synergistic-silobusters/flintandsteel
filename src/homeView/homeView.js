angular.module('flintAndSteel')
.controller('HomeViewCtrl',
    [
        '$scope', '$state',
        function($scope, $state){
            $scope.navToBrowse = function navToBrowse() {
                $state.go('ideabrowse');
            };
        }
    ]
);
