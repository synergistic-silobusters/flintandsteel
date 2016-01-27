describe('DialogBackCtrl', function() {
    "use strict";

    var scope, ctrl, $rootScope, $controller, $mdDialog, backingObj, author, ideaSvcMock, userSvcMock;

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

    describe('adding a new back', function() {

        beforeEach(function() {
            backingObj = {
                text: '',
                types: ''
            };
            author = 1;

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
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
});
