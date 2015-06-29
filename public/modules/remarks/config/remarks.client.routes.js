'use strict';

//Setting up route
angular.module('remarks').config(['$stateProvider',
	function($stateProvider) {
		// Remarks state routing
		$stateProvider.
		state('listRemarks', {
			url: '/remarks',
			templateUrl: 'modules/remarks/views/list-remarks.client.view.html'
		}).
		state('createRemark', {
			url: '/remarks/create',
			templateUrl: 'modules/remarks/views/create-remark.client.view.html'
		}).
		state('viewRemark', {
			url: '/remarks/:remarkId',
			templateUrl: 'modules/remarks/views/view-remark.client.view.html'
		}).
		state('editRemark', {
			url: '/remarks/:remarkId/edit',
			templateUrl: 'modules/remarks/views/edit-remark.client.view.html'
		});
	}
]);