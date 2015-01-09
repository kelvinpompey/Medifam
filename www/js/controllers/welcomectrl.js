
angular.module('medifam.controllers')
.controller('WelcomeCtrl', function($window, $state, $scope, $ionicModal, $timeout, $rootScope, $cordovaToast, Push, Image){  
    
    $scope.myStyle = {height: ($window.innerHeight - 100) + 'px'}; 
    Parse.initialize("b9x7EC9SNIUX5DB5mxrt8yzF9eduW0Js4kkR6Jcf", "pCqIyIaYhXx3sH0weqnkEKGGqo5rt3UVe6pZOJA7");

  // Form data for the login modal
  $scope.loginData = {};
    $scope.registrationData = {}; 

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
    
// Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });    
    

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
    
  $scope.closeRegisterModal = function() {
    $scope.registerModal.hide();
  };    

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
    
  $scope.register = function() {
    $scope.registerModal.show();
  };  
    

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
      /*
      Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
          success: function() {
              console.log('logged in successfully'); 
              $rootScope.currentUser = Parse.User.current(); 
              $state.go('app.specialties'); 
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
              console.log('error logging in'); 
          }
      }); */ 
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password)
    .then(function(){
      console.log('logged in successfully'); 
      $cordovaToast.showShortCenter("Logged in successfully");
      $rootScope.currentUser = Parse.User.current(); 
      delete $scope.loginError;      
      $scope.closeLogin(); 
      $state.go('app.specialties');
      Push.register(); 
    })
    .fail(function(error){
      $scope.loginError = error; 
      console.log('error logging in');
    })      
  };
     
  $scope.doRegister = function() {
      console.log('registrationData', $scope.registrationData); 
      var newUser = new Parse.User(); 
      newUser.setUsername($scope.registrationData.username); 
      newUser.setPassword($scope.registrationData.password); 
      newUser.setEmail($scope.registrationData.email); 
      newUser.set('degree', $scope.registrationData.degree); 
      newUser.set('phone', $scope.registrationData.phone);
      newUser.set('address', $scope.registrationData.address);
      newUser.set('university', $scope.registrationData.university);
      newUser.set('work', $scope.registrationData.work);
      
      newUser.signUp().then(function(user){        
          console.log('user registered successfully'); 
          $cordovaToast.showShortCenter("Registration completed successfully");
          $rootScope.currentUser = Parse.User.current(); 
          $scope.closeRegisterModal(); 
          $state.go("app.specialties");

          //Push.register(); 
      })
      .fail(function(error){
          $scope.registrationError = error; 
          console.log('error signing up ', error); 
      }); 
  }

  $scope.imageSelect = function() {
    Image.select()
      .then(function (results) {
        $scope.registrationData.diploma = results[0]; 

      }, function(error) {
        // error getting photos
      });       
  }
    

})