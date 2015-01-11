angular.module('medifam.controllers')
.controller('ProfileCtrl', function($state, $scope, $timeout, $rootScope, $ionicNavBarDelegate, $ionicModal, Specialty, Push, $cordovaImagePicker){    
    
    console.log('imagePicker: ', window.imagePicker); 
    $scope.image = '';

    $scope.profileData = {
      fullName: $scope.currentUser.get('fullName'),
      work: $scope.currentUser.get('work'), 
      degree: $scope.currentUser.get('degree'), 
      university: $scope.currentUser.get('university'), 
      address: $scope.currentUser.get('address'), 
      phone: $scope.currentUser.get('phone'), 
    }


    var firstTime = true; 
    $scope.$watch('profileData.fullName + profileData.work + profileData.phone + profileData.address + profileData.degree + profileData.university', function(newValue, oldValue){
      console.log('profileData changed: ', newValue);       
      if(firstTime !== true) {
        $scope.profileData.changed = true;   
      }
      else {
        firstTime = false; 
      }     
      
    });

    $scope.updateProfile = function() {

      $scope.currentUser.set('fullName', $scope.profileData.fullName); 
      $scope.currentUser.set('work', $scope.profileData.work); 
      $scope.currentUser.set('degree', $scope.profileData.degree); 
      $scope.currentUser.set('university', $scope.profileData.university); 
      $scope.currentUser.set('address', $scope.profileData.address); 
      $scope.currentUser.set('phone', $scope.profileData.phone); 
      $scope.currentUser.save().then(function(){
        $scope.profileData.changed = false; 
      }); 

    };  

    $scope.profileData.changed = false; 

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

  $scope.removeSpecialty = function(specialty) {
    console.log('removeSpecialty: ', specialty); 
    $scope.currentUser.relation('specialties').remove(specialty); 
    $scope.currentUser.save().then(function(){
      fetchUserData(); 
    }); 

    specialty.relation('members').remove($scope.currentUser);
    specialty.save(); 
  }; 


  $scope.statuses = [
    {title: 'Available'}, 
    {title: 'In surgery'}, 
    {title: 'In a meeting'}, 
    {title: 'On call'}, 
    {title: 'Off call'}


  ]; 
  $scope.selectStatusModal = function() {
    $ionicModal.fromTemplateUrl('templates/status.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show(); 
    });

  }
  
  $scope.selectStatus = function(item) {
    console.log('status: ', item); 
    $scope.currentUser.set('status', item.title); 
    $scope.currentUser.save(); 
    $scope.status = item; 
  }


  $scope.refresh = function() {
      
  }
    
    if($scope.currentUser) {
        $scope.status = {title: $scope.currentUser.get('status')}; 
        console.log('Profile for user ', $scope.currentUser.getUsername());
    
        $ionicNavBarDelegate.setTitle('Profile for ' + $scope.currentUser.getUsername()); 
        
        fetchUserData(); 
    }
    
    $scope.logout = function() {
        Parse.User.logOut(); 
        $rootScope.currentUser = Parse.User.current();        
        $state.go('welcome');         
        Push.unregister(); 
    }
    
})