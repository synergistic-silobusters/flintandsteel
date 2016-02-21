/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */

describe('AboutCtrl', function() {
    "use strict";

    var ctrl, paginateSvc;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function($controller, _paginateSvc_) {
        paginateSvc = _paginateSvc_;

        ctrl = $controller('AboutCtrl', {
            paginateSvc: paginateSvc
        });
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });
});
