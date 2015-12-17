/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('HomeViewCtrl', function() {
    "use strict";

    var scope, ctrl, $state;

    beforeEach(module('flintAndSteel'));
    beforeEach(module('ui.router'));

    beforeEach(inject(function($rootScope, $controller, _$state_) {
        scope = $rootScope.$new();
        $state = _$state_;
        ctrl = $controller('HomeViewCtrl', {
            $scope: scope,
            $state: $state
        });
    }));

    it('should exist', function() {
        expect(scope).toBeDefined();
    });

    describe('navToBrowse()', function() {
        beforeEach(function() {
            spyOn($state, 'go');
        });

        it('should go to ideabrowse state', function() {
            scope.navToBrowse();
            expect($state.go).toHaveBeenCalledWith('ideabrowse');
        });
    });
});
