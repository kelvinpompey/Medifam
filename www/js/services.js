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
.factory('Message', function(){
	return {
		send: function(params) {
			var message = new Parse.Object('Message'); 
			message.set("from", params.from); 
			message.set("to", params.to); 
			message.set("text", params.text); 
			return message.save(); 
		}
	}
})
.factory('Push', function($rootScope, $cordovaPush){
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
		}
	}		

});
