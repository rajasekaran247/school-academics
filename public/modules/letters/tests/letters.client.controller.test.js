'use strict';

(function() {
	// Letters Controller Spec
	describe('Letters Controller Tests', function() {
		// Initialize global variables
		var LettersController,
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

			// Initialize the Letters controller.
			LettersController = $controller('LettersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Letter object fetched from XHR', inject(function(Letters) {
			// Create sample Letter using the Letters service
			var sampleLetter = new Letters({
				name: 'New Letter'
			});

			// Create a sample Letters array that includes the new Letter
			var sampleLetters = [sampleLetter];

			// Set GET response
			$httpBackend.expectGET('letters').respond(sampleLetters);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.letters).toEqualData(sampleLetters);
		}));

		it('$scope.findOne() should create an array with one Letter object fetched from XHR using a letterId URL parameter', inject(function(Letters) {
			// Define a sample Letter object
			var sampleLetter = new Letters({
				name: 'New Letter'
			});

			// Set the URL parameter
			$stateParams.letterId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/letters\/([0-9a-fA-F]{24})$/).respond(sampleLetter);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.letter).toEqualData(sampleLetter);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Letters) {
			// Create a sample Letter object
			var sampleLetterPostData = new Letters({
				name: 'New Letter'
			});

			// Create a sample Letter response
			var sampleLetterResponse = new Letters({
				_id: '525cf20451979dea2c000001',
				name: 'New Letter'
			});

			// Fixture mock form input values
			scope.name = 'New Letter';

			// Set POST response
			$httpBackend.expectPOST('letters', sampleLetterPostData).respond(sampleLetterResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Letter was created
			expect($location.path()).toBe('/letters/' + sampleLetterResponse._id);
		}));

		it('$scope.update() should update a valid Letter', inject(function(Letters) {
			// Define a sample Letter put data
			var sampleLetterPutData = new Letters({
				_id: '525cf20451979dea2c000001',
				name: 'New Letter'
			});

			// Mock Letter in scope
			scope.letter = sampleLetterPutData;

			// Set PUT response
			$httpBackend.expectPUT(/letters\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/letters/' + sampleLetterPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid letterId and remove the Letter from the scope', inject(function(Letters) {
			// Create new Letter object
			var sampleLetter = new Letters({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Letters array and include the Letter
			scope.letters = [sampleLetter];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/letters\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLetter);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.letters.length).toBe(0);
		}));
	});
}());