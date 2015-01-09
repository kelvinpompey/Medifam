angular.module('medifam.controllers')
.controller('MediaCtrl', function($scope, $ionicModal){
	var fetchRecentMessages = function() {
		var query1 = new Parse.Query('Message'); 
		query1.equalTo("to", $scope.currentUser); 
		query1.exists("image");

		var query2 = new Parse.Query('Message'); 
		query2.equalTo("to", $scope.currentUser); 
		query2.exists("audio");	

		var query = Parse.Query.or(query1, query2); 

		query.descending('createdAt'); 
		query.find().then(function(data){
			console.log('recent: ', data); 
			data.forEach(function(item){
				item.get('from').fetch(); 
			}); 
			$scope.messages = data; 
		});
	}

	fetchRecentMessages(); 

	var showModal = function() {
		$ionicModal.fromTemplateUrl('templates/image-detail.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
			$scope.modal.show(); 
		});		
	}

	var toggleAudio = function(message) {
		console.log("toggle audio for message: ", message); 
		if($scope.audio) {
			$scope.audio.stop(); 
		}

		window.audio = $scope.audio; 
		$scope.audio = new Media(message.get('audio').url()); 
		$scope.audio.play(); 

	}	

	$scope.closeModal = function() {
		$scope.modal.hide();
	};	

	$scope.itemSelected = function(message) {
		$scope.selectedMessage = message; 
		console.log('selectedMessage: ', message);
		if(message.get('image')) {
			showModal(); 
		}
		else if(message.get('audio')) {
			toggleAudio(message); 
		}
	}

}); 