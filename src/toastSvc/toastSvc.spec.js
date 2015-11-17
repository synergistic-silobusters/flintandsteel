/* global describe */
/* global module */
/* global beforeEach */
/* global inject */
/* global it */
/* global expect */
/* global spyOn */

describe('toastSvc', function() {
    "use strict";

    var toastSvc, $mdToast, message, toastPreset;

    beforeEach(module('flintAndSteel'));

    beforeEach(inject(function(_toastSvc_, _$mdToast_) {
        toastSvc = _toastSvc_;
        $mdToast = _$mdToast_;

        message = 'This is a test message';
        toastPreset = undefined;

        spyOn($mdToast, 'show');
    }));

    it('should display a toast with the given message', function() {
        toastPreset = $mdToast.simple().content(message).position('top right').hideDelay(toastSvc.TOAST_DURATION_LONG).action('OK');

        toastSvc.show(message);

        expect($mdToast.show).toHaveBeenCalledWith(toastPreset);
    });

    it('should display a toast with customized options', function() {
        var options = {
            position: 'top left',
            duration: '1337'
        };
        toastPreset = $mdToast.simple().content(message).position(options.position).hideDelay(options.duration).action('OK');

        toastSvc.show(message, options);

        expect($mdToast.show).toHaveBeenCalledWith(toastPreset);
    });
});