const app = angular.module('cms', [])

app.controller('cmsController', ['$scope', '$http', ($scope, $http) => {
	$scope.sectionList = [{}]
	$scope.input = {
		sectionId: 'css',
		sectionName: 'css guideline',
		sectionHeader: 'css/sass',
		sectionIcon: 'icon'
	}

	$scope.getSection = () => {
		$http.get('sectionList').then( res => { 
      $scope.sectionList = res.data
    })
	}
	
	$scope.postSection = () => {
		$http.post('sectionAdd', $scope.input).then( (req, res) => {
			console.log(req)
		})
		$scope.getSection()
	}

	$scope.log = () => {
		console.log($scope.sectionList)
		console.log($scope.input)
	}
	
	$scope.init = () => {
		$scope.getSection()
	}

}])

