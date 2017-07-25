const app = angular.module('cms', [])

app.controller('mainController', ['$scope', ($scope) => {
	$scope.isSidebarActive = false

	$scope.toggleSidebar = () => {
		$scope.isSidebarActive = !$scope.isSidebarActive
	}
}])

app.controller('sectionController', ['$scope', '$http', ($scope, $http) => {
	$scope.sectionList = [{}]
	$scope.newInput = {}
	$scope.editInput = {}
	$scope.isTabActive = 'new'
	$scope.isFormActive = ''

	$scope.getSection = () => {
		$http.get('sectionList').then( res => { 
      $scope.sectionList = res.data
    })
	}
	
	$scope.postSection = () => {
		$http.post('sectionAdd', $scope.newInput).then( () => {
			$scope.getSection()
			alert(`Section ${$scope.newInput.sectionName} has been created!`)
			$scope.resetInput()
		})
	}
	
	$scope.deleteSection = (section) => {
		$http.post('sectionDelete', section).then( () => {
			$scope.getSection()
			alert(`Section ${section.sectionName} has been deleted!`)
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
			if(newData.sectionName || newData.sectionId || newData.sectionHeader || newData.sectionIcon){
				alert(`Section ${newData.sectionName} has been updated!`)
			}
		})
	}

	$scope.resetInput = () => {
		$scope.newInput = {}
		$scope.editInput = {}
	}

	$scope.showForm = (target) => {
		$scope.resetInput()
		$scope.isFormActive = target
	}

}])

app.controller('moduleController', ['$scope', '$http', ($scope, $http) => {
	$scope.rawModuleList = [{}]
	$scope.moduleList = [{}]
	$scope.sectionList = [{}]
	$scope.newModule = {}
	$scope.editModule = {}
	$scope.isModalActive = false
	$scope.isTabActive = 'new'

	$scope.getModule = () => {
		$http.get('moduleList').then( res => { 
      $scope.rawModuleList = res.data
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
			alert(`Module '${$scope.newModule.name}' has been created!`)
			$scope.resetInput()
		})
	}
	
	$scope.updateModule = () => {
		$http.post('moduleEdit', $scope.editModule).then( (res, req) => {
			$scope.getModule()
			$scope.resetInput()
			$scope.dismissModal()
			alert(`Module '${$scope.editModule.name}' has been updated!`)
		})
	}

	$scope.deleteModule = (module) => {
		const sectionId = module.section

		$http.post('moduleDelete', module).then( () => {
			$scope.getModule()
			$scope.changeTab(sectionId)
			alert(`Module '${module.name}' has been deleted!`)
		})		
	}

	$scope.resetInput = () => {
		$scope.newModule = {}
	}

	$scope.loadModal = (module) => {
		$scope.isModalActive = true
		$scope.editModule = module
		$http.get(`getModule/${module.id}`).then( (res, req) => {
			$scope.editModule.content = res.data
		})
	}

	$scope.dismissModal = () => {
		$scope.isModalActive = false
	}

	$scope.changeTab = tabId => {
		$scope.isTabActive = tabId
		$scope.moduleList = $scope.rawModuleList.filter( current => {
			return current.section == tabId
		})
	}

	$scope.init = () => {
		$scope.getSection()
		$scope.getModule()
	}

}])

