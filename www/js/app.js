// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('medifam', ['ionic', 'medifam.controllers', 'medifam.services', 'parse-angular','ngCordova', 'angularMoment'])

.run(function($ionicPlatform, $rootScope, $state, $cordovaPush, Push, $cordovaVibration) {
    console.log('.run'); 
  $ionicPlatform.ready(function() {
      console.log('ionic ready');

    /*
    cordova.plugins.backgroundMode.setDefaults({ text:'Medifam'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        var time = 0; 
        setInterval(function () {
            // Modify the currently displayed notification
            time += 5; 
            $cordovaVibration.vibrate(500);
            /*cordova.plugins.backgroundMode.configure({
                text:'Running in background for more than ' + time + 's now.'
            });
        }, 5000);
    }      
    */ 

    $rootScope.currentUser = Parse.User.current(); 
    
    //console.log('WelcomeCtrl User: ', Parse.User.current()); 
    
    // If User is logged in redirect to /app/specialties 

    
    var registerPush = function() {
      var androidConfig = {
        "senderID": "966734857442"
      };

      $cordovaPush.register(androidConfig).then(function(result) {
        // Success
        console.log('push registered successfully ', result); 
      }, function(err) {
        // Error
        console.log('push registration error ', err); 
      });
    }    
    
    if($rootScope.currentUser) {
        $state.go('app.specialties');     
        //Push.register();
    }       
      
      
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    Parse.initialize("b9x7EC9SNIUX5DB5mxrt8yzF9eduW0Js4kkR6Jcf", "pCqIyIaYhXx3sH0weqnkEKGGqo5rt3UVe6pZOJA7");    
    console.log("config"); 
    
  $stateProvider

  .state('welcome',{
      url: '/welcome', 
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
  })
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
  .state('app.profile', {
      url: '/profile', 
      views: {
        'menuContent': {
            templateUrl: 'templates/profile.html', 
            controller: 'ProfileCtrl'
        }  
      }
  })  
    .state('app.specialties', {
      url: "/specialties",
      views: {
        'menuContent': {
          templateUrl: "templates/specialties.html",
          controller: 'SpecialtiesCtrl'
        }
      }
    })
    .state('app.specialty-detail', {
      url: "/specialties/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/specialty-detail.html",
          controller: 'SpecialtyDetailCtrl'
        }
      }
    })
    .state('app.messages', {
      url: "/messages/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/messages.html",
          controller: 'MessagesCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/welcome');
});
