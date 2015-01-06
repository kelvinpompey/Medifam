angular.module('medifam.controllers')
.controller('RecentCtrl', function($scope){
	var fetchRecentMessages = function() {
		var query = new Parse.Query('Message'); 
		query.equalTo("to", $scope.currentUser); 
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
}); 