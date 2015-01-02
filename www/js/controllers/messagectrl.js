angular.module('medifam.controllers')
.controller('MessagesCtrl', function($window, $scope, $stateParams, $ionicModal, Message, Image, $cordovaImagePicker, $ionicNavBarDelegate, $cordovaToast, $cordovaCapture){
    $scope.style = {'margin-top': '40px', height: ($window.innerHeight - 100) + 'px'}; 
	$scope.chatboxStyle = { position: 'fixed', bottom: '0px', width: '100%'}; 
	$scope.emergencyStyle = { position: 'absolute', right: '55px', color: 'yellow'};  	

	$scope.toggleEmergency = function() {
		if($scope.emergencyStyle.color === 'yellow') {
			$scope.emergencyStyle.color = 'red';
		}
		else {
			$scope.emergencyStyle.color = 'yellow';	
		}
	}

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
		$scope.messageData.emergencyCode = $scope.emergencyStyle.color; 
		console.log('doSendMessage: ', $scope.messageData);
		Message.send($scope.messageData).then(function(){
			console.log('Message sent'); 
			$cordovaToast.showShortCenter("Message sent! :)");
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

  $scope.imageSelect = function() {
    Image.select()
      .then(function (results) { 
	        window.resolveLocalFileSystemURL(results[0], function(data){ 
	            var fileEntry = data;
	            fileEntry.file(function(data){
	                console.log('fileEntry.file: ', data);
	                var file = data;  
	                var reader = new FileReader(); 
	                reader.onload = function(e){
	                    var base64 = this.result; 
	                    console.log('reader loaded with this,result: ', this.result);
	                    var parseFile = new Parse.File("image.png", {base64: base64});	                                        
	                    $scope.messageData.image = parseFile; 
	                    $scope.doSendMessage(); 
	                }; 
	                reader.readAsDataURL(file); 
	                
	            }); 
	        });

      }, function(error) {
        // error getting photos
      });       
  }	

  $scope.audioSelect = function() {
    var options = { limit: 1, duration: 10 };

    $cordovaCapture.captureAudio(options).then(function(audioData) {
      // Success! Audio data is here
      console.log('audio data: ', audioData); 
		window.resolveLocalFileSystemURL(audioData[0].fullPath, function(data){ 
		    var fileEntry = data;
		    fileEntry.file(function(data){
		        console.log('fileEntry.file: ', data);
		        var file = data;  
		        var reader = new FileReader(); 
		        reader.onload = function(e){
		            var base64 = this.result; 
		            console.log('reader loaded with this,result: ', this.result);
		            var parseFile = new Parse.File("audio.amr", {base64: base64});	                                        
		            $scope.messageData.audio = parseFile; 
		            $scope.doSendMessage(); 
		        }; 
		        reader.readAsDataURL(file); 
		        
		    }); 
		});      
    }, function(err) {
      // An error occurred. Show a message to the user
    });
  }

  $scope.toggleAudio = function(message) {
  	console.log("toggle audio for message: ", message); 
  	if($scope.audio) {
  		$scope.audio.stop(); 
  	}

  	window.audio = $scope.audio; 
  	$scope.audio = new Media(message.get('audio').url()); 
  	$scope.audio.play(); 

  }



});