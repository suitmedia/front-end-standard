const app = angular.module('cms', [])

app.controller('cmsController', ['$scope', '$http', ($scope, $http) => {
	$scope.sectionList = [{}]
	$scope.newInput = {}
	$scope.editInput = {}

	$scope.getSection = () => {
		$http.get('sectionList').then( res => { 
      $scope.sectionList = res.data
    })
	}
	
	$scope.postSection = () => {
		$http.post('sectionAdd', $scope.newInput).then( (req, res) => {
			console.log(res)
			$scope.getSection()
			$scope.resetInput()
		})
	}
	
	$scope.deleteSection = (section) => {
		$http.post('sectionDelete', section).then( (req, res) => {
			console.log(res)
			$scope.getSection()
		})
	}
	
	$scope.editSection = (sectionId) => {
		let newData = {
			id: sectionId,
			sectionId: $scope.editInput.sectionId,
			sectionName: $scope.editInput.sectionName,
			sectionHeader: $scope.editInput.sectionHeader,
			sectionIcon: $scope.editInput.sectionIcon
		}

		$http.post('sectionEdit', newData).then( (req, res) => {
			console.log(res)
			$scope.getSection()
		})
	}

	$scope.resetInput = () => {
		$scope.newInput = {}
		$scope.editInput = {}
	}

	$scope.showForm = (target) => {
		let targetObj = document.querySelector(`#${target}`)
		let forms = [...document.querySelectorAll('.section-form')]

		$scope.resetInput()
		forms.forEach( current => {
			current.style.display = 'none'
		})
		targetObj.style.display = 'block'
	}

}])

