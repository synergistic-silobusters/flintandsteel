/* global angular */

angular.module('flintAndSteel')
.controller('WhirlCtrl',
    [
        '$scope',
        function($scope) {
            "use strict";

            var ctrl = this;

            // List the images you want to scroll through
            $scope.slides = [
                {label: 1, img: '../assets/Announcement1.jpg', show: true},
                {label: 2, img: '../assets/Announcement2.jpg', show: false},
                {label: 3, img: '../assets/Announcement3.jpg', show: false}
            ];

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
                }
            };

            // Every 3 seconds, navigate forward one slide
            var delay = 5000;
            var id = window.setInterval(increment, delay);
            function increment() {
                $scope.navigate(1);
            };

        }
    ]
);
