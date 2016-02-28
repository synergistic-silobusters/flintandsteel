/* global angular */

angular.module('flintAndSteel')
.controller('PictureDialogController',
    [
        '$scope', '$mdDialog', 'learnItem',

        function($scope, $mdDialog, learnItem) {
            "use strict";
            $scope.item = learnItem;
            $scope.answer = function() {
                $mdDialog.hide();
            };
        }
    ]
);
