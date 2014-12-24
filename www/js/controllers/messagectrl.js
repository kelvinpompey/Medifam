angular.module('medifam.controllers')
.controller('MessagesCtrl', function($scope, $stateParams, $ionicModal, Message){

	$scope.messageData = {}; 

	$ionicModal.fromTemplateUrl('templates/new-message.html', {
		scope: $scope,
	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	console.log('userId: ', $stateParams.id); 

	var fetchMessages = function() {

		var query = new Parse.Query(Parse.User); 
		query.get($stateParams.id).then(function(user){
			console.log('user'); 
			$scope.user = user; 
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
	}

	fetchMessages(); 

	$scope.doSendMessage = function() {
		$scope.messageData.from = $scope.currentUser;
		$scope.messageData.to = $scope.user;
		console.log('doSendMessage: ', $scope.messageData);
		Message.send($scope.messageData).then(function(){
			console.log('Message sent'); 
			fetchMessages(); 
		})
	}; 

});