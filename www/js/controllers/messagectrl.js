angular.module('medifam.controllers')
.controller('MessagesCtrl', function($scope, $stateParams){
	console.log('userId: ', $stateParams.id); 

	var query = new Parse.Query(Parse.User); 
	query.get($stateParams.id).then(function(user){
		console.log('user'); 
		var sentQuery = new Parse.Query('Message'); 
		var receivedQuery = new Parse.Query('Message'); 
		sentQuery.equalTo('from', user);
		sentQuery.equalTo('to', $scope.currentUser);

		receivedQuery.equalTo('to', user); 
		receivedQuery.equalTo('from', $scope.currentUser); 

		sentQuery.find().then(function(data1){
			receivedQuery.find().then(function(data2){
					var messages = data1.concat(data2);
					$scope.messages = messages; 
				}); 
					
		}); 

	
		
	}); 

});