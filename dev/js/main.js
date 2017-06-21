/*! [PROJECT_NAME] | Suitmedia */

((window, document, undefined) => {

    const path = {
        css: `${myPrefix}assets/css/`,
        js : `${myPrefix}assets/js/vendor/`
    }

    const assets = {
        _objectFit      : `${path.js}object-fit-images.min.js`
    }

    const isActive = 'is-active'

    const Site = {
        enableActiveStateMobile() {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', () => {}, true)
            }
        },

        WPViewportFix() {
            if ( '-ms-user-select' in document.documentElement.style && navigator.userAgent.match(/IEMobile/) ) {
                let style = document.createElement('style')
                let fix = document.createTextNode('@-ms-viewport{width:auto!important}')

                style.appendChild(fix)
                document.head.appendChild(style)
            }
        },

        objectFitPolyfill() {
            load(assets._objectFit).then( () => {
                objectFitImages()
            })
        },

        angularModule() {
            const app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'hljs'])

            app.controller('mainCtrl', ($scope, $route) => {
                $scope.$route = $route;
            })

            app.controller('homeCtrl', ($scope) => {
                $scope.pageHeader = 'Suitmedia <br>Front-end Styleguides'
            })

            app.controller('cssCtrl', ($scope) => {
                $scope.pageHeader = 'Suitmedia <br>CSS Styleguides'
            })

            app.controller('htmlCtrl', ($scope) => {
                $scope.pageHeader = 'Suitmedia <br>HTML Styleguides'
            })

            app.controller('toolsCtrl', ($scope) => {
                $scope.pageHeader = 'Front-end Tools/Plugins'
            })

            app.controller('jsCtrl', ($scope) => {
                $scope.pageHeader = 'Suitmedia <br>Javascript Styleguides'
            })

            app.config( $routeProvider => {
                $routeProvider
                .when('/', {
                    templateUrl: 'home.html',
                    controller: 'homeCtrl'
                })
                .when('/css', {
                    templateUrl: 'css.html',
                    controller: 'cssCtrl'
                })
                .when('/html', {
                    templateUrl: 'html.html',
                    controller: 'htmlCtrl'
                })
                .when('/tools', {
                    templateUrl: 'tools.html',
                    controller: 'toolsCtrl'
                })
                .when('/js', {
                    templateUrl: 'js.html',
                    controller: 'jsCtrl'
                })
            })
        }
    }

    Promise.all([
        
    ]).then(() => {
        for (let fn in Site) {
            Site[fn]()
        }
        window.Site = Site
    })

    function exist(selector) {
        return new Promise((resolve, reject) => {
            let $elem = $(selector)

            if ( $elem.length ) {
                resolve($elem)
            } else {
                reject(`no element found for ${selector}`)
            }
        })
    }

    function load(url) {
        return new Promise((resolve, reject) => {
            Modernizr.load({
                load: url,
                complete: resolve
            })
        })
    }

    function loadJSON(url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                if ( res.ok ) {
                    resolve(res.json())
                } else {
                    reject('Network response not ok')
                }
            }).catch(e => {
                reject(e)
            })
        })
    }

})(window, document)
