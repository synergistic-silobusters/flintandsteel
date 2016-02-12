/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('LoginDialogCtrl', function() {
    "use strict";

    var scope, ctrl, $mdDialog;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($rootScope, $controller, _$mdDialog_) {
        scope = $rootScope.$new();
        $mdDialog = _$mdDialog_;

        ctrl = $controller('LoginDialogCtrl', {
            $scope: scope,
            $mdDialog: $mdDialog
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.cancel', function() {
        it('should cause the mdDialog to be canceled', function() {
            spyOn($mdDialog, 'cancel').and.callFake(function() {});

            scope.cancel();

            expect($mdDialog.cancel).toHaveBeenCalledWith();
        });
    });

    describe('$scope.login', function() {

        it('should hide the mdDialog and pass back the login credentials', function() {
            var account = {
                username: 'test3',
                password: 'test'
            };

            spyOn($mdDialog, 'hide').and.callFake(function() {});

            scope.login(account);

            expect($mdDialog.hide).toHaveBeenCalledWith(account);
        });
    });
});
