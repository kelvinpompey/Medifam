angular.module('medifam.services', [])
.factory('Specialty', function(){
    Parse.initialize("b9x7EC9SNIUX5DB5mxrt8yzF9eduW0Js4kkR6Jcf", "pCqIyIaYhXx3sH0weqnkEKGGqo5rt3UVe6pZOJA7");
    
    return {
        all: function() {
            var query = new Parse.Query('Specialty'); 
            return query.find(); 
        }
    }
    
})
.factory('Message', function($rootScope){
	return {
		send: function(params) {
			var message = new Parse.Object('Message'); 
			message.set("from", params.from); 
			message.set("to", params.to); 
			message.set("text", params.text); 
			message.set("image", params.image); 
			message.set("emergencyCode", params.emergencyCode); 
			message.set("audio", params.audio); 
			message.set("read", false); 
			return message.save(); 
		},

		countUnread: function() {
			var query = new Parse.Query('Message'); 
			query.equalTo('to', $rootScope.currentUser); 
			query.equalTo('read', false); 
			query.count().then(function(n){
				$rootScope.unread = n; 
				console.log('unread count: ', n); 
			});  
		}
	}
})
.factory('Push', function($rootScope, $cordovaPush, $http){
	var androidConfig = {
		"senderID": "966734857442"
	};

	return {
		register: function() {
			  $cordovaPush.register(androidConfig).then(function(result) {
	            // Success
	            console.log('push registered successfully ', result); 
	          }, function(err) {
	            // Error
	            console.log('push registration error ', err); 
	          });				

		}, 

		unregister: function() {
			  $cordovaPush.unregister(androidConfig).then(function(result) {
			    console.log('unregistered successfully ', result); 
			  }, function(err) {
			    console.log('error unregistering ', err); 
			  });			
		}, 

		send: function(user) {
			$http.post('http://safyahpush.herokuapp.com/push2', {
				senderId: 'AIzaSyDwdGUMTipesKtiEhJXt5h1RrwHxeaS6zo', 
				registrationIds: [user.get('registrationId')], 
				message: 'New Message', 
				title: 'MediFam'
			}).success(function(data){
				console.log('push response: ', data); 
			}); 
		}
	}		

})
.factory('Image', function($cordovaImagePicker){
  var options = {
   maximumImagesCount: 10,
   width: 800,
   height: 800,
   quality: 80
  };

  return {
  	select: function() {
	  return $cordovaImagePicker.getPictures(options); 

  	}
  }

});
