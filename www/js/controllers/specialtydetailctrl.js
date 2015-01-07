angular.module('medifam.controllers')
.controller('SpecialtyDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate, $cordovaToast, $ionicModal, $cordovaCapture, Message, Push, Image){

	$ionicModal.fromTemplateUrl('templates/new-message.html', {
		scope: $scope,
	animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.emergencyStyle = { position: 'absolute', right: '80px', color: 'yellow'};  	

	$scope.toggleEmergency = function() {
		console.log('toggle tapped'); 
		if($scope.emergencyStyle.color === 'yellow') {
			$scope.emergencyStyle.color = 'red';
		}
		else {
			$scope.emergencyStyle.color = 'yellow';	
		}
	}

	$scope.openModal = function() {
		$scope.modal.show();
	};
	$scope.closeModal = function() {
		$scope.modal.hide();
	};


	$scope.messageData = {}; 

	var sendMessage = function(data) {
		//$scope.messageData.from = $scope.currentUser;
		//$scope.messageData.to = $scope.user;
		//$scope.messageData.emergencyCode = $scope.emergencyStyle.color; 
		console.log('doSendMessage: ', $scope.messageData);
		Message.send(data).then(function(){
			console.log('Message sent'); 
			if($cordovaToast.showShortCenter) {
				$cordovaToast.showShortCenter("Message broadcast! :)");
			}
			Push.send(data.to); 
		})		
	}; 

	$scope.broadcast = function() {
		console.log("length: ", $scope.messageData.text.length); 
		return; 
		
		$scope.members.forEach(function(user){
			var data = {
				text: $scope.messageData.text,
				image: $scope.messageData.image, 
				audio: $scope.messageData.audio, 
				from: $scope.currentUser, 
				to: user, 
				read: false, 
				emergencyCode: $scope.emergencyStyle.color
			}; 
			sendMessage(data); 

		}); 
	}    
    
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
	                    $scope.broadcast(); 
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
		            $scope.broadcast(); 
		        }; 
		        reader.readAsDataURL(file); 
		        
		    }); 
		});      
	}, function(err) {
	  // An error occurred. Show a message to the user
	});
	}



    var fetchData = function() {
        var specialty = new Parse.Object('Specialty'); 
        specialty.id = $stateParams.id; 
        specialty.fetch()
        .then(function(data){
            console.log('specialty: ', data);
            $ionicNavBarDelegate.setTitle(data.get('title')); 
            $scope.specialty = data; 
            specialty.relation('members').query().find()
            .then(function(members){
                console.log('members: ', members);
                $scope.members = members; 
            });
        });

    }
    fetchData();     
});