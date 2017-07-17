const app = angular.module('cms', [])

app.controller('sectionController', ['$scope', '$http', ($scope, $http) => {
	$scope.sectionList = [{}]
	$scope.newInput = {}
	$scope.editInput = {}

	$scope.getSection = () => {
		$http.get('sectionList').then( res => { 
      $scope.sectionList = res.data
    })
	}
	
	$scope.postSection = () => {
		$http.post('sectionAdd', $scope.newInput).then( () => {
			$scope.getSection()
			$scope.resetInput()
		})
	}
	
	$scope.deleteSection = (section) => {
		$http.post('sectionDelete', section).then( () => {
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

		$http.post('sectionEdit', newData).then( () => {
			$scope.getSection()
		})
	}

	$scope.resetInput = () => {
		$scope.newInput = {}
		$scope.editInput = {}
	}

	$scope.showForm = (target) => {
		let targetForms = document.getElementById(target)
		let forms = [...document.querySelectorAll('.section-form')]
		let editBtn = document.getElementById(`btn${target}`)
		let editBtns = [...document.querySelectorAll('.btn-edit')]

		$scope.resetInput()

		forms.forEach( current => {
			current.style.display = 'none'
		})
		editBtns.forEach( current => {
			current.style.display = 'inline-block'
		})
		targetForms.style.display = 'block'
		editBtn.style.display = 'none'
	}

}])

app.controller('moduleController', ['$scope', '$http', ($scope, $http) => {
	$scope.moduleList = [{}]
	$scope.sectionList = [{}]
	$scope.newModule = {}
	$scope.editModule = {}

	$scope.getModule = () => {
		$http.get('moduleList').then( res => { 
      $scope.moduleList = res.data
		})
	}

	$scope.getSection = () => {
		$http.get('sectionList').then( res => { 
      $scope.sectionList = res.data
    })
	}

	$scope.postModule = () => {
		$http.post('moduleAdd', $scope.newModule).then( () => {
			$scope.getModule()
			$scope.resetInput()
		})
	}
	
	$scope.updateModule = () => {
		$http.post('moduleEdit', $scope.editModule).then( (res, req) => {
			console.log(res)
			$scope.getModule()
			$scope.resetInput()
		})
	}

	$scope.deleteModule = (module) => {
		$http.post('moduleDelete', module).then( () => {
			$scope.getModule()
		})
	}

	$scope.resetInput = () => {
		$scope.newModule = {}
	}

	$scope.showModal = (module) => {
		let modal = document.querySelector('.modal')

		$scope.editModule = module
		$http.get(`getModule/${module.id}`).then( (res, req) => {
			$scope.editModule.content = res.data
		})

		modal.style.display='block'
		document.querySelector('.modal-exit').addEventListener('click', e => {
			modal.style.display='none'
		})
	}

	$scope.init = () => {
		$scope.getSection()
		$scope.getModule()
	}

}])

