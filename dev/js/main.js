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
            const app = angular.module('App', ['ngRoute', 'hljs', 'hc.marked', 'ngSanitize'])

            app.controller('mainCtrl', ['$scope', '$rootScope', '$route', ($scope, $rootScope, $route) => {
                $rootScope.sectionList = sectionList
                $scope.$route = $route
            }])

            app.controller('homeCtrl', ['$scope', $scope => {
                $scope.sectionNumber = 0
                $scope.pageHeader = ''
            }])

            app.controller('pageCtrl', ['$scope', '$rootScope', '$routeParams', ($scope, $rootScope, $routeParams) => {
                $scope.moduleList = moduleList
                $scope.sectionNumber = Math.floor($routeParams.pageId)
                $scope.pageHeader =  $rootScope.sectionList
                                        .filter( a => a.sectionNum === $scope.sectionNumber )
                                        .reduce ( a => a )
                                        .sectionHeader
            }])

            app.directive('sectionLoader', () => {
                return {
                    restrict: 'A',
                    scope: {
                        module: '=ngModel'
                    },
                    template: `<marked ng-include="module.url" compile="true"></marked>`
                }
            })

            app.config( ['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
                $routeProvider
                .when('/', {
                    templateUrl: 'home.html',
                    controller: 'homeCtrl'
                })
                .when('/page/:pageId', {
                    templateUrl: 'page.html',
                    controller: 'pageCtrl'
                })
            }])

            app.config(['markedProvider', markedProvider => {
                markedProvider.setOptions({
                    sanitize: true,
                    pedantic: true,

                    highlight: (code, lang) => {
                        if (lang) {
                            return hljs.highlight(lang, code, true).value
                        } else {
                            return hljs.highlightAuto(code).value
                        }
                    }
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
