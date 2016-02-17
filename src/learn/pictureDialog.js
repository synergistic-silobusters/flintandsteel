function DialogController($scope, $mdDialog, learnItem1) {

    $scope.item = learnItem1;

  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function() {
    $mdDialog.hide();
  };
}
