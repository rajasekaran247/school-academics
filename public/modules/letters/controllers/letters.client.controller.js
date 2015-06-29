'use strict';

// Letters controller
angular.module('letters').controller('LettersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Letters',
	function($scope, $stateParams, $location, Authentication, Letters) {
		$scope.authentication = Authentication;

		// Create new Letter
		$scope.create = function() {
			// Create new Letter object
			var letter = new Letters ({
				name: this.name
			});

			// Redirect after save
			letter.$save(function(response) {
				$location.path('letters/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Letter
		$scope.remove = function(letter) {
			if ( letter ) { 
				letter.$remove();

				for (var i in $scope.letters) {
					if ($scope.letters [i] === letter) {
						$scope.letters.splice(i, 1);
					}
				}
			} else {
				$scope.letter.$remove(function() {
					$location.path('letters');
				});
			}
		};

		// Update existing Letter
		$scope.update = function() {
			var letter = $scope.letter;

			letter.$update(function() {
				$location.path('letters/' + letter._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Letters
		$scope.find = function() {
			$scope.letters = Letters.query();
		};

		// Find existing Letter
		$scope.findOne = function() {
			$scope.letter = Letters.get({ 
				letterId: $stateParams.letterId
			});
		};
	}
]);