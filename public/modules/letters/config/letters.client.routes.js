'use strict';

//Setting up route
angular.module('letters').config(['$stateProvider',
	function($stateProvider) {
		// Letters state routing
		$stateProvider.
		state('listLetters', {
			url: '/letters',
			templateUrl: 'modules/letters/views/list-letters.client.view.html'
		}).
		state('createLetter', {
			url: '/letters/create',
			templateUrl: 'modules/letters/views/create-letter.client.view.html'
		}).
		state('viewLetter', {
			url: '/letters/:letterId',
			templateUrl: 'modules/letters/views/view-letter.client.view.html'
		}).
		state('editLetter', {
			url: '/letters/:letterId/edit',
			templateUrl: 'modules/letters/views/edit-letter.client.view.html'
		});
	}
]);