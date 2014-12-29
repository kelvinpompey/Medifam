angular.module('medifam.controllers')
.controller('MessagesCtrl', function($window, $scope, $stateParams, $ionicModal, Message, $cordovaImagePicker, $ionicNavBarDelegate){
    $scope.style = {'margin-top': '40px', height: ($window.innerHeight - 100) + 'px'}; 
	$scope.chatboxStyle = {position: 'fixed', bottom: '0px', width: '100%'}; 

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
			$ionicNavBarDelegate.setTitle(user.get('fullName')); 
			var sentQuery = new Parse.Query('Message'); 
			var receivedQuery = new Parse.Query('Message'); 
			sentQuery.equalTo('from', user);
			sentQuery.equalTo('to', $scope.currentUser);

			receivedQuery.equalTo('to', user); 
			receivedQuery.equalTo('from', $scope.currentUser); 

			sentQuery.find().then(function(data1){
				receivedQuery.find().then(function(data2){
						for(var i = 0; i < data2.length; i++) {
							data2[i].sender = true; 
						} 					
						var messages = data1.concat(data2);
						$scope.messages = messages; 
						console.log('messages2: ', data1); 

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

	$scope.addPhoto = function() {

	  var options = {
	   maximumImagesCount: 10,
	   width: 800,
	   height: 800,
	   quality: 80
	  };

	  $cordovaImagePicker.getPictures(options)
	    .then(function (results) {
	      for (var i = 0; i < results.length; i++) {
	        console.log('Image URI: ' + results[i]);
	      }
	    }, function(error) {
	      // error getting photos
	    });
	}; 


});