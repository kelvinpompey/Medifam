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
              Push.register(); 
          }, 
          error: function() {
              console.log('error logging in'); 
          }
      }); 
      
      $scope.closeLogin();
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

.controller('WelcomeCtrl', function($window, $state, $scope, $ionicModal, $rootScope, Push){
    
    $scope.myStyle = {height: $window.innerHeight + 'px'}; 
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
      
      Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
          success: function() {
              console.log('logged in successfully'); 
              $rootScope.currentUser = Parse.User.current(); 
              Push.register(); 
              $state.go('app.specialties'); 
          }, 
          error: function() {
              console.log('error logging in'); 
          }
      }); 
      
      $scope.closeLogin();
  };
     
  $scope.doRegister = function() {
      console.log('registrationData', $scope.registrationData); 
      var newUser = new Parse.User(); 
      newUser.setUsername($scope.registrationData.username); 
      newUser.setPassword($scope.registrationData.password); 
      newUser.setEmail($scope.registrationData.email); 
      
      newUser.signUp().then(function(user){        
          console.log('user registered successfully'); 
          $rootScope.currentUser = Parse.User.current(); 
          Push.register(); 
      })
      .fail(function(error){
          console.log('error signing up ', error); 
      }); 
  }
    

})
.controller('ProfileCtrl', function($scope, $timeout, $rootScope, $ionicNavBarDelegate, $ionicModal, Specialty, Push){    
    
    console.log('imagePicker: ', window.imagePicker); 
    $scope.image = '';
    $scope.selectImage = function() {
        
      var options = {
       maximumImagesCount: 10,
       width: 800,
       height: 800,
       quality: 80
      };
    
      /*    
      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            console.log('Image URI: ' + results[i]);
          }
        }, function(error) {
          // error getting photos
        }); 
        */ 
        
        window.imagePicker.getPictures(
            function(results) {
                $timeout(function(){
                    $scope.image = results[0]; 
                    console.log('$scope.image: ', $scope.image); 
                }); 
                console.log('results: ', results); 
                
                window.resolveLocalFileSystemURL(results[0], function(data){ 
                    var fileEntry = data;
                    fileEntry.file(function(data){
                        console.log('fileEntry.file: ', data);
                        var file = data;  
                        var reader = new FileReader(); 
                        reader.onload = function(e){
                            var base64 = this.result; 
                            console.log('reader loaded with this,result: ', this.result);
                            var parseFile = new Parse.File("profile.png", {base64: base64}); 
                            $scope.currentUser.set('profileImage', parseFile); 
                            $scope.currentUser.save()
                            .then(function(){
                                console.log("image saved successfully"); 
                            }); 
                        }; 
                        reader.readAsDataURL(file); 
                        
                    }); 
                }); 
                
                
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);
                }
            }, function (error) {
                console.log('Error: ' + error);
            }
        );         
    }
    
    

  var fetchData = function() {
    
    var profileImage = $scope.currentUser.get('profileImage'); 
    if(profileImage) {
        $scope.image = profileImage.url(); 
    }
      
    Specialty.all().then(function(data){
        $scope.specialties = data; 
    });
  }
  
  fetchData(); 
    
  var fetchUserData = function() {
    var relation = $scope.currentUser.relation('specialties');
    relation.query().find().then(function(data){
        console.log('specialties for user: ', data); 
        $scope.userSpecialties = data; 
    });       
  }
  
    
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/select-specialty.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.showModal = function() {
    $scope.modal.show();
  };    
    
  $scope.addItem = function(item) {
      console.log('item added: ', item.get('title'), ' user ', $scope.currentUser.getUsername()); 
      $scope.currentUser.relation('specialties').add(item); 
      $scope.currentUser.save().then(function(data){
          console.log('relation saved successfully'); 
          fetchUserData(); 
      }).fail(function(error){
          console.log('failed to save relation ', error); 
      });
      
      item.relation('members').add($scope.currentUser); 
      item.save(); 
  }
  
  $scope.refresh = function() {
      
  }
    
    if($scope.currentUser) {
        console.log('Profile for user ', $scope.currentUser.getUsername());
    
        $ionicNavBarDelegate.setTitle('Profile for ' + $scope.currentUser.getUsername()); 
        
        fetchUserData(); 
    }
    
    $scope.logout = function() {
        Parse.User.logOut(); 
        $rootScope.currentUser = Parse.User.current();        
        Push.unregister(); 
    }
    
});

