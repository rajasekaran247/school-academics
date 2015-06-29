'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Some example string
        $scope.helloText = 'Welcome to School-Academics';
        $scope.descriptionText = 'This is a web application for School-Academics. You can use it to Provision Time-table, Provide/Generate Online Letters, Record Attendance and Monitor Discipline, Evaluate punctuality, Take Feedback, Exam Setup, Evaluation & Score Processing, Generation Of Progress Reports and Promotions.';
	}
]);