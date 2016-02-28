/* global angular */

angular.module('flintAndSteel')
.controller('PictureDialogCtrl',
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
