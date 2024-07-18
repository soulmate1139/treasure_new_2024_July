const firebaseConfig = {
  apiKey: "AIzaSyDswg9cQD3ZDhna5AgkqYYGZaDQdh7vMB0",
  authDomain: "treasure-12775.firebaseapp.com",
  projectId: "treasure-12775",
  storageBucket: "treasure-12775.appspot.com",
  messagingSenderId: "1072205479135",
  appId: "1:1072205479135:web:d6e043ae176fa260023d6a",
  measurementId: "G-LL06PDYT7H",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Initialize variables
const auth = firebase.auth();
const database = firebase.database();
var user_data = {};
var trackings;
var email = "admin@gts.com",
  password = "yifhsk42";

function get_data_from_database() {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(function () {
      // Add this user to Firebase Database
      var firebaseRef = firebase.database().ref("users");
      firebaseRef.once("value", function (snapshot) {
        snapshot.forEach(function (element) {
          if (element.val().email == email) {
            user_data = element.val();
          }
        });
      });
      setTimeout(fromTracker, 4000);
    })
    .catch(function (error) {
      //hide_loader();
      var error_message = error.message;
      swal(error_message);
    });
}

//Set up our register function
function register() {
  swal("Processing...");
  // Get all our input fields
  var firstname = document.getElementById("firstname").value,
    lastname = document.getElementById("lastname").value,
    email = document.getElementById("email").value,
    phone = document.getElementById("phone").value,
    gender = document.getElementById("gender").value,
    dob = document.getElementById("dob").value,
    country = document.getElementById("country").value,
    city = document.getElementById("city").value,
    username = document.getElementById("username").value,
    password = document.getElementById("password").value;

  auth
    .createUserWithEmailAndPassword(email, "yifhsk42")
    .then(function () {
      var user = auth.currentUser;
      // Add this user to database
      var database_ref = database.ref();
      // Create User data
      var user_data = {
        firstname,
        lastname,
        trackings: [
          {
            tracking_no: "pending",
            sent_date: "begin",
            delivery_date: "pending",
            from: "from",
            to: "to",
            current: "current location",
            status: "in transit",
            progress_level: "0",
          },
        ],
        phone,
        gender,
        dob,
        country,
        city,
        username,
        email,
        word: password,
        last_login: getCurrentTime(new Date()),
      };

      database_ref.child("users/" + user.uid).set(user_data);
      setTimeout(goToVerify, 4000);
    })
    .catch(function (error) {
      var error_message = error.message;
      console.log(error);
    });
}

function goToVerify() {
  window.location = "login.html";
}

var user_details_holder;
function login() {
  swal("Please wait while we process your data...");
  var email = document.getElementById("email").value;
  if (email == "" || document.getElementById("password").value == "") {
    swal("Kindly, input all fields");
  } else {
    auth
      .signInWithEmailAndPassword(email, "yifhsk42")
      .then(function () {
        // Declare user variable
        var user = auth.currentUser;
        // Add this user to Firebase Database
        var database_ref = database.ref();
        var firebaseRef = firebase.database().ref("users");
        firebaseRef.once("value", function (snapshot) {
          snapshot.forEach(function (element) {
            if (element.val().email == email) {
              user_details_holder = element.val();
              console.log(user_details_holder);
            }
          });
          // Create User data
          var user_data = {
            ...user_details_holder,
            last_login: getCurrentTime(new Date()),
          };
          // Push to Firebase Database
          database_ref.child("users/" + user.uid).update(user_data);
          setTimeout(fromLogin, 4000);
        });
        // User Logged In
      })
      .catch(function (error) {
        console.log(error);
        swal("Something went wrong!", "email not found", "error");
      });
  }
}
function fromLogin() {
  if (user_details_holder.word == document.getElementById("password").value) {
    swal("logged In");
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("user_info", JSON.stringify(user_details_holder));
    window.location = "profile/index.html";
  } else {
    swal("Something went wrong!", "password is incorrect", "error");
  }
}

trackings = user_data.trackings;
function tracker() {
  if (document.getElementById("tracking_no").value !== "") {
    swal("Processing...");
    get_data_from_database();
  }
}

function fromTracker() {
  console.log(user_data.trackings);
  trackings = user_data.trackings;
  var tracking_no = document.getElementById("tracking_no").value;
  var isFound = false;
  user_data.trackings.forEach((element) => {
    if (element.tracking_no == tracking_no) {
      isFound = true;
      localStorage.setItem("tracked_info", JSON.stringify(element));
      window.location = "track_page/index.html";
    }
  });
  if (!isFound) {
    swal("error", "Package not found!", "error");
  } else {
    isFound = false;
  }
}

function getCurrentTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return (
    date.getMonth() +
    1 +
    "/" +
    date.getDate() +
    "/" +
    date.getFullYear() +
    "  " +
    strTime
  );
}

if (localStorage.getItem("isLogin") == "true") {
  document.getElementsByClassName("login_class")[0].innerHTML =
    "\n                Dashboard\n              ";
  document.getElementById("login_to_dash").style.display = "none";
}

function show_dashboard() {
  if (localStorage.getItem("isLogin") == "true") {
    window.location = "profile/index.html";
  }
}
