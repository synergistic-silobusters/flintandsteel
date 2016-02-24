/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('LearnCtrl', function() {
    "use strict";

    var ctrl, paginateSvc;
    var scope;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($controller, _paginateSvc_, $rootScope) {
        paginateSvc = _paginateSvc_;
        scope = $rootScope.$new();

        ctrl = $controller('LearnCtrl', {
            paginateSvc: paginateSvc,
            $scope: scope
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
});
