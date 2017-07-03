/*! [PROJECT_NAME] | Suitmedia */

((window, document, undefined) => {

    const path = {
        css: `${myPrefix}assets/css/`,
        js : `${myPrefix}assets/js/vendor/`
    }

    const assets = {
        _objectFit      : `${path.js}object-fit-images.min.js`
    }

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
            const app = angular.module('App', ['ngRoute', 'hljs'])

            app.controller('mainCtrl', ['$scope', '$route', ($scope, $route) => {
                $scope.$route = $route;
            }])

            app.controller('homeCtrl', ['$scope', $scope => {
                $scope.pageHeader = ''
                $scope.isSection = 0
            }])

            app.controller('cssCtrl', ['$scope', $scope => {
                $scope.pageHeader = 'CSS/SASS'
                $scope.isSection = 1
            }])

            app.controller('htmlCtrl', ['$scope', $scope => {
                $scope.pageHeader = 'HTML'
                $scope.isSection = 1
            }])

            app.controller('toolsCtrl', ['$scope', $scope => {
                $scope.pageHeader = 'Tools & Plugins'
                $scope.isSection = 1
            }])

            app.controller('jsCtrl', ['$scope', $scope => {
                $scope.pageHeader = 'Javascript'
                $scope.isSection = 1
            }])

            app.config( ['$routeProvider', $routeProvider => {
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
            }])
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