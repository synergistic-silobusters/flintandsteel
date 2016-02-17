function DialogController($scope, $mdDialog, learnItem) {
    "use strict";
    $scope.item = learnItem;

    $scope.answer = function() {
        $mdDialog.hide();
    };
}
