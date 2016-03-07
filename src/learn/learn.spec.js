/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('LearnCtrl', function() {
    "use strict";

    var ctrl, $mdDialog;
    var scope, $controller, $window;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_$controller_, $rootScope, _$mdDialog_) {
        scope = $rootScope.$new();
        $mdDialog = _$mdDialog_;
        $controller = _$controller_;
        $window = {
            ga: function() {} // Google Analytics
        };
    }));

    function createController() {
        return $controller('LearnCtrl', {
            $mdDialog: $mdDialog,
            $scope: scope,
            $window: $window
        });
    }

    it('should exist', function() {
        ctrl = createController(scope);
        expect(ctrl).toBeDefined();
    });


    describe('$scope.showAdvanced', function() {
        beforeEach(function() {
            spyOn($mdDialog, 'show').and.callThrough();
            ctrl = createController();
        });

        it('should show a dialog window when called', function() {
            scope.showAdvanced(null, {title: "Learn How to Do This"});
            expect($mdDialog.show).toHaveBeenCalled();
        });
    });

});

describe('PictureDialogCtrl', function() {
    "use strict";
    var $controller, scope, $mdDialog, learnItem, ctrl;

    beforeEach(module('flintAndSteel'));
    beforeEach(inject(function($rootScope, _$controller_, _$mdDialog_) {
        scope = $rootScope.$new();
        $controller = _$controller_;
        $mdDialog = _$mdDialog_;
        learnItem = {
            title: "Test",
            imgSource: "assets/learn/learnToComment.gif",
            orderImg: "1",
            orderDesc: "2",
            description: "Test"
        };
    }));

    function createController(learnItem) {
        return $controller('PictureDialogCtrl', {
            $scope: scope,
            $mdDialog: $mdDialog,
            learnItem: learnItem
        });
    }

    beforeEach(function() {
        spyOn($mdDialog, 'hide').and.callThrough();
        ctrl = createController(learnItem);
    });

    it('should exist', function() {
        ctrl = createController(learnItem);
        expect(ctrl).toBeDefined();
    });

    it('should close a dialog window when called', function() {
        scope.answer();
        expect($mdDialog.hide).toHaveBeenCalled();
    });

});
