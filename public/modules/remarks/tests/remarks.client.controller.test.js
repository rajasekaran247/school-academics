'use strict';

(function() {
	// Remarks Controller Spec
	describe('Remarks Controller Tests', function() {
		// Initialize global variables
		var RemarksController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Remarks controller.
			RemarksController = $controller('RemarksController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Remark object fetched from XHR', inject(function(Remarks) {
			// Create sample Remark using the Remarks service
			var sampleRemark = new Remarks({
				name: 'New Remark'
			});

			// Create a sample Remarks array that includes the new Remark
			var sampleRemarks = [sampleRemark];

			// Set GET response
			$httpBackend.expectGET('remarks').respond(sampleRemarks);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.remarks).toEqualData(sampleRemarks);
		}));

		it('$scope.findOne() should create an array with one Remark object fetched from XHR using a remarkId URL parameter', inject(function(Remarks) {
			// Define a sample Remark object
			var sampleRemark = new Remarks({
				name: 'New Remark'
			});

			// Set the URL parameter
			$stateParams.remarkId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/remarks\/([0-9a-fA-F]{24})$/).respond(sampleRemark);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.remark).toEqualData(sampleRemark);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Remarks) {
			// Create a sample Remark object
			var sampleRemarkPostData = new Remarks({
				name: 'New Remark'
			});

			// Create a sample Remark response
			var sampleRemarkResponse = new Remarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Remark'
			});

			// Fixture mock form input values
			scope.name = 'New Remark';

			// Set POST response
			$httpBackend.expectPOST('remarks', sampleRemarkPostData).respond(sampleRemarkResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Remark was created
			expect($location.path()).toBe('/remarks/' + sampleRemarkResponse._id);
		}));

		it('$scope.update() should update a valid Remark', inject(function(Remarks) {
			// Define a sample Remark put data
			var sampleRemarkPutData = new Remarks({
				_id: '525cf20451979dea2c000001',
				name: 'New Remark'
			});

			// Mock Remark in scope
			scope.remark = sampleRemarkPutData;

			// Set PUT response
			$httpBackend.expectPUT(/remarks\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/remarks/' + sampleRemarkPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid remarkId and remove the Remark from the scope', inject(function(Remarks) {
			// Create new Remark object
			var sampleRemark = new Remarks({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Remarks array and include the Remark
			scope.remarks = [sampleRemark];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/remarks\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRemark);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.remarks.length).toBe(0);
		}));
	});
}());