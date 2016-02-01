/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('DialogBackCtrl', function() {
    "use strict";

    var scope, ctrl, $rootScope, $controller, $mdDialog, backingObj, author, ideaSvcMock, userSvcMock;

    backingObj = {
        text: '',
        types: []
    };

    author = 1;

    var authorAccount = {
        id: 1,
        username: 'MainManDarth',
        name: 'Darth Vader'
    };

    beforeEach(module('flintAndSteel'));
    // needed because $state takes us to home by default
    beforeEach(module('homeView/homeView.tpl.html'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$mdDialog_, _ideaSvcMock_, _userSvcMock_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        scope = $rootScope.$new();
        $mdDialog = _$mdDialog_;
        ideaSvcMock = _ideaSvcMock_;
        userSvcMock = _userSvcMock_;
    }));

    beforeEach(function() {
        ctrl = $controller('DialogBackCtrl', {
            $scope: scope,
            $mdDialog: $mdDialog,
            backingObj: backingObj,
            author: author,
            ideaSvc: ideaSvcMock,
            userSvc: userSvcMock
        });
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('$scope.cancel', function() {
        it('should cancel the dialog', function() {
            spyOn($mdDialog, 'cancel').and.callThrough();
            scope.cancel();
            expect($mdDialog.cancel).toHaveBeenCalled();
        });
    });

    describe('ctrl.isUserAuthor', function() {
        it('should return true if user is author', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(ctrl.isUserAuthor()).toBe(true);
        });
    });

    describe('$scope.backIdea', function() {
        var testBack;

        it('should hide the dialog and pass the back object', function() {
            testBack = {
                text: '',
                selectTypes: []
            };
            spyOn($mdDialog, 'hide').and.callThrough();
            spyOn(scope, 'backObject').and.callThrough();
            scope.backIdea();

            expect(scope.backObject).toHaveBeenCalled();
            expect($mdDialog.hide).toHaveBeenCalledWith(testBack);
        });
    });

    describe('ctrl.initialize', function() {
        var mockIdea;

        beforeEach(function() {
            mockIdea = ideaSvcMock.getIdea().$$state.value.data;
            scope.tempTypes = mockIdea.backs[1].types;
        });

        it('should return the owner back if idea author', function() {
            userSvcMock.checkLogin(authorAccount);
            expect(ctrl.isUserAuthor()).toBe(true);
            ctrl.initialize();
            expect(scope.selectTypes[0].name).toBe('Owner');
        });

        it('should check backing tags if they have been selected before', function() {
            ctrl.initialize();
            expect(scope.selectTypes.length).toBe(2);
            expect(scope.types[0].checked).toBe(true);
            expect(scope.types[1].checked).toBe(false);
        });
    });

    describe('$scope.toggle', function() {
        var testObj;

        beforeEach(function() {
            scope.types = ideaSvcMock.getBackTypeChips();
            testObj = { name: 'Experience', _lowername: 'experience' };
        });

        it('should add to types if not there', function() {
            scope.selectTypes = [];

            scope.toggle(testObj, 0);
            expect(scope.selectTypes).toEqual([testObj]);
            expect(scope.types[0].checked).toBe(true);
        });

        it('should remove type if already chosen', function() {
            scope.selectTypes = [testObj];

            scope.toggle(testObj, 0);
            expect(scope.selectTypes).toEqual([]);
            expect(scope.types[0].checked).toBe(false);
        });
    });
});
