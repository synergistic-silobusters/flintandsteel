/* global angular */

angular.module('flintAndSteel')
.controller('WhirlCtrl',
    [
        '$scope',
        function($scope) {
            "use strict";

            var ctrl = this;
            var delayTime = 5000; // Time for incrementing through slides

            // List the images you want to scroll through
            $scope.slides = [
                {label: 1, img: '../assets/Announcement1.jpg'},
                {label: 2, img: '../assets/Announcement2.jpg'},
                {label: 3, img: '../assets/Announcement3.jpg'}
            ];

            //$scope.current = 0;

            // Check to make sure the document has finished loading the html
            //   before processing it and taging with of the elems are shown
            var tid = setInterval( function () {
                if ( document.readyState !== 'complete' ) return;
                clearInterval( tid );

                $scope.control();
            }, 100 );

            // Once the document is finished loading, it will tag the first
            //   image as "current" in the html
            $scope.control = function control() {
                $scope.check = 0;
                ctrl.box = document.querySelector('.whirligig-container');
                ctrl.next = ctrl.box.querySelector('.next');
                ctrl.prev = ctrl.box.querySelector('.prev');
                ctrl.items = ctrl.box.querySelectorAll('li');
                ctrl.counter = ctrl.items.length-1;
                ctrl.amount = ctrl.items.length;
                ctrl.current = ctrl.items[ctrl.counter];
                ctrl.box.classList.add('active');

                ctrl.current.classList.remove('not');
                ctrl.current.classList.add('new');
                $scope.current = ctrl.counter;
            };

            // Used to navigate slides.  A given direction of -1 will give the
            //   previous image, a direction of 1 will give the next image,
            //   and a direction of 0 will give the current image
            $scope.navigate = function navigate(direction) {
                if (typeof ctrl.current != 'undefined') {
                    ctrl.current.classList.remove('current');
                    ctrl.current.classList.remove('new');
                    ctrl.current.classList.add('not');
                    if (direction === -1 && ctrl.counter <= 0) {
                        ctrl.counter = ctrl.amount - 1;
                    } else if (direction === 1 && ctrl.counter >= ctrl.amount-1) {
                        ctrl.counter = 0;
                    } else {
                        ctrl.counter = ctrl.counter + direction;
                    }
                    ctrl.current = ctrl.items[ctrl.counter];
                    ctrl.current.classList.add('current');
                    ctrl.current.classList.remove('not');

                    // If navigate is used, restart slide interval
                    clearInterval( ctrl.id );
                    ctrl.id = window.setInterval(increment, delayTime);
                    function increment() {
                        $scope.navigate(1);
                    };
                }
            };

            // Every 5 seconds, navigate forward one slide
            ctrl.id = window.setInterval(increment, delayTime);
            function increment() {
                $scope.navigate(1);
            };

        }
    ]
);
