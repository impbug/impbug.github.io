/**
 * Function called when clicking the Login/Logout button.
 */
// [START buttoncallback]
function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('https://www.googleapis.com/auth/plus.login');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // [START_EXCLUDE]
      document.getElementById('google-oauthtoken').textContent = token;
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [START_EXCLUDE]
  document.getElementById('google-sign-in').disabled = true;
  // [END_EXCLUDE]
}
// [END buttoncallback]

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('google-sign-in-status').textContent = 'Signed in';
      document.getElementById('google-sign-in').textContent = 'Sign out';
      document.getElementById('google-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // User is signed out.
      // [START_EXCLUDE]
      document.getElementById('google-sign-in-status').textContent = 'Signed out';
      document.getElementById('google-sign-in').textContent = 'Sign in with Google';
      document.getElementById('google-account-details').textContent = 'null';
      document.getElementById('google-oauthtoken').textContent = 'null';
      // [END_EXCLUDE]
    }
    // [START_EXCLUDE]
    document.getElementById('google-sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]
  document.getElementById('google-sign-in').addEventListener('click', toggleSignIn, false);
  document.getElementById('write-data').addEventListener('click', writeData, false);
  document.getElementById('remove-data').addEventListener('click', removeData, false);
  renewList();
}

window.onload = function() {
  initApp();
};

function writeData() {
  var sglid = document.getElementById('sglid').value;
  firebase.database().ref('glass/' + sglid).set({
    glid: sglid,
    glname: document.getElementById('sglname').value,
    gltel: document.getElementById('sgltel').value,
    gladdr: document.getElementById('sgladdr').value,
    glweb: document.getElementById('sglweb').value,
    glvisit: 'N',
  });
}

function removeData() {
  firebase.database().ref('glass/' + document.getElementById('sglid').value).remove();
}

function renewList(snapshot) {
	var vsBody = '';
	var key = '';
	var childData = {};

  var ref = firebase.database().ref('glass');

  ref.on('value', 
  function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      key = childSnapshot.key;
      childData = childSnapshot.val();
      vsBody += '<div class="card col-sm-3"> <div class="card-block">'
              + '<h5 class="card-title">'+childData.glname+' <small class="text-muted">'+childData.glid+' ('+childData.glvisit+')</small></h5>'
              + '<ul><li><a href="tel:'+childData.gltel+'">'+childData.gltel+'</a></li>'
              + '<li><a target="_blank" href="https://www.google.com.tw/maps/place/'+childData.gladdr+',18z">'+childData.gladdr+'</a></li>'
              + '<li><a target="_blank" href="'+childData.glweb+'">'+childData.glweb+'</a></li><ul></div></div>';
    });
    $('#theList').html(vsBody);
  }, 
  function(error) {
      console.log('Error: ' + error.code);
  });
}