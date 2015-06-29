'use strict';

//Setting up route
angular.module('timetables').config(['$stateProvider',
	function($stateProvider) {
		// Timetables state routing
		$stateProvider.
		state('listTimetables', {
			url: '/timetables',
			templateUrl: 'modules/timetables/views/list-timetables.client.view.html'
		}).
		state('createTimetable', {
			url: '/timetables/create',
			templateUrl: 'modules/timetables/views/create-timetable.client.view.html'
		}).
		state('viewTimetable', {
			url: '/timetables/:timetableId',
			templateUrl: 'modules/timetables/views/view-timetable.client.view.html'
		}).
		state('editTimetable', {
			url: '/timetables/:timetableId/edit',
			templateUrl: 'modules/timetables/views/edit-timetable.client.view.html'
		});
	}
]);