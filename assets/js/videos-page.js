angular.module('brushfire_videosPage', [])
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      '*://www.youtube.com/**'
    ]);
  }]);

angular.module('brushfire_videosPage').controller('PageCtrl', [
  '$scope', '$http',
  function($scope, $http) {

    /////////////////////////////////////////////////////////////////////////////
    // Immediately start fetching list of videos from the server.
    /////////////////////////////////////////////////////////////////////////////

    // First, show a loading spinner
    $scope.videosLoading = true;

    $scope.submitVideosError = false;

    // Get the existing videos.
    io.socket.get('/video', function whenServerResponds(data, JWR) {
      $scope.videosLoading = false;

      if (JWR.statusCode >= 400) {
        $scope.submitVideosError = true;
        console.log('something bad happened');
        return;
      }
      $scope.videos = data;

      // Apply the changes to the DOM
      // (we have to do this since `io.socket.get` is not a
      // angular-specific magical promisy-thing)  
      $scope.$apply();

      io.socket.on('video', function whenAVideoIsCreatedUpdatedOrDestroyed(event) {

        // Add the new video to the DOM
        $scope.videos.unshift({
          title: event.data.title,
          src: event.data.src,
        });

        // Apply the changes to the DOM
        // (we have to do this since `io.socket.get` is not a
        // angular-specific magical promisy-thing)
        $scope.$apply();
      });
    });

    ///////////////////////////////////////////////////////////////
    // SET UP LISTENERS FOR DOM EVENTS
    ///////////////////////////////////////////////////////////////

    /**
     * When new video is submitted...
     * (the binding from our form's "submit" event to this function is
     *  handled via `ng-submit="submitNewVideo($event)` in the HTML)
     */

    $scope.submitNewVideo = function() {

      // A little "spin-lock" to prevent double-submission
      // (because disabling the submit button still allows double-posts
      //  if a user hits the ENTER key to submit the form multiple times.)
      if ($scope.busySubmittingVideo) {
        return;
      }

      // Harvest the data out of the form
      // (thanks to ng-model, it's already in the $scope object)
      var _newVideo = {
        title: $scope.newVideoTitle,
        src: $scope.newVideoSrc,
      };

      // create placeholder anchor element
      var parser = document.createElement('a');

      // assign url to parser.href
      parser.href = _newVideo.src

      // Use the indexOf parser.search as the first argument and length of
      // parser.search as the second argument of parser.search.substring
      // The result is the YouTube ID --> LfOWehvvuo0
      var youtubeID = parser.search.substring(parser.search.indexOf("=") + 1, parser.search.length);

      _newVideo.src = 'https://www.youtube.com/embed/' + youtubeID;

      // (this is where you put your client-side validation when relevant)

      // Side note:
      // Why not use something like `$scope.videoForm.title` or `$scope.newVideo.title`?
      // While this certainly keeps things more organized, it is a bit risky in the Angular
      // world.  I'm no Angular expert, but we have run into plenty of 2-way-binding issues/bugs
      // in the past from trying to do this.  I've found two guiding principles that help prevent
      // these sorts of issues:
      // + very clearly separate the $scope variables in your form from the $scope variables
      //   representing the rest of your page.
      // + don't point `ng-model` at the property of an object or array (e.g. `ng-model="foo.bar"`)
      //   Angular handles its 2-way bindings by reference, and it's not too hard to get into weird
      //   situations where your objects are all tangled up.

      // Now we'll submit the new video to the server:

      // First, show a loading state
      // (also disables form submission)
      io.socket.post('/video', { //#A
        title: _newVideo.title,
        src: _newVideo.src
      }, function whenServerResponds(data, JWR) {
        $scope.videosLoading = false;
        if (JWR.statusCode >= 400) { //#B
          console.log('something bad happened');
          return;
        }
        $scope.videos.unshift(_newVideo); //#C

        // Hide the loading state
        // (also re-enables form submission)
        $scope.busySubmittingVideo = false;

        //Clear out form inputs
        $scope.newVideoTitle = '';
        $scope.newVideoSrc = '';
        $scope.$apply(); //#D
      });
    };
  }
]);