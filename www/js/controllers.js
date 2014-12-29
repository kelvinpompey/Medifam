angular.module('medifam.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $cordovaPush, Push) {
    
    Parse.initialize("b9x7EC9SNIUX5DB5mxrt8yzF9eduW0Js4kkR6Jcf", "pCqIyIaYhXx3sH0weqnkEKGGqo5rt3UVe6pZOJA7");
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
      
      Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
          success: function() {
              console.log('logged in successfully'); 
              $rootScope.currentUser = Parse.User.current(); 
              $timeout(function() {
                delete $scope.loginError; 
              });
              $scope.closeLogin();
              Push.register(); 
          }, 
          error: function(user, error) {
              $timeout(function() {
                $scope.loginError = error; 
              });
              console.log('error logging in ', error); 
          }
      }); 
      
      
  };

  $rootScope.$on('pushNotificationReceived', function(event, notification) {
    switch(notification.event) {
      case 'registered':
        if (notification.regid.length > 0 ) {
          alert('registration ID = ' + notification.regid);
          $rootScope.currentUser.set('registrationId', notification.regid); 
          $rootScope.currentUser.save();
        }
        break;

      case 'message':
        // this is the actual push notification. its format depends on the data model from the push server
        alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
        break;

      case 'error':
        alert('GCM error = ' + notification.msg);
        break;

      default:
        alert('An unknown GCM event has occurred');
        break;
    }
  });


})

.controller('SpecialtiesCtrl', function($scope) {
    var query = new Parse.Query('Specialty'); 
    query.find().then(function(data){
        console.log('specialties: ', data); 
        $scope.specialties = data; 
    })
    .fail(function(error){
        console.log('failed: ', error); 
    }); 
    
  $scope.specialties = [
    { title: 'General', id: 1 },
    { title: 'Pediactrics', id: 2 },
    { title: 'Neurology', id: 3 },
    { title: 'Orthopedics', id: 4 },
    { title: 'Cardiology', id: 5 },
    { title: 'Anesthetics', id: 6 },
      {title: 'Nurses' , id: 7 }
  ];
  
})

.controller('SpecialtyDetailCtrl', function($scope, $stateParams, $ionicNavBarDelegate){
    console.log('id: ', $stateParams.id); 
    
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
    
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

; 



