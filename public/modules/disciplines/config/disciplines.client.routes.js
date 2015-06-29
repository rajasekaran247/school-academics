'use strict';

//Setting up route
angular.module('disciplines').config(['$stateProvider',
	function($stateProvider) {
		// Disciplines state routing
		$stateProvider.
		state('listDisciplines', {
			url: '/disciplines',
			templateUrl: 'modules/disciplines/views/list-disciplines.client.view.html'
		}).
		state('createDiscipline', {
			url: '/disciplines/create',
			templateUrl: 'modules/disciplines/views/create-discipline.client.view.html'
		}).
		state('viewDiscipline', {
			url: '/disciplines/:disciplineId',
			templateUrl: 'modules/disciplines/views/view-discipline.client.view.html'
		}).
		state('editDiscipline', {
			url: '/disciplines/:disciplineId/edit',
			templateUrl: 'modules/disciplines/views/edit-discipline.client.view.html'
		});
	}
]);