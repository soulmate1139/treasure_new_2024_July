// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
        apiKey: "AIzaSyCVN7rbQHrAGtx5b84JPVIzblZZ__xD_4A",
        authDomain: "tracking-site-84f1a.firebaseapp.com",
        projectId: "tracking-site-84f1a",
        storageBucket: "tracking-site-84f1a.appspot.com",
        messagingSenderId: "18925366233",
        appId: "1:18925366233:web:1ec85ace401e790b4c87c8",
        measurementId: "G-VP6W0JRG7H"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth()
    const database = firebase.database()
    var user_details_holder;
    
    constructor();
    function constructor(){
        get_data_from_database();
    }

    function get_data_from_database() {
        auth.signInWithEmailAndPassword("tracker@gmail.com", "Tracker123")
        .then(function() {
            // Add this user to Firebase Database
            var firebaseRef = firebase.database().ref("users");
            firebaseRef.once("value", function(snapshot){
                snapshot.forEach(function(element){
                    //   if(element.val().email == "tracker@gmail.com"){
                    user_details_holder = element.val();
                    //   }
                })
            })
        })
        .catch(function(error) {
            var error_message = error.message;
            alert(error_message)
        })
    }

    function tracker() {
        if (document.getElementById("tracking_no").value !== "") {
            swal("Processing...");
            GotoDetails();
        }
    }

    function GotoDetails(){
        var user_data = user_details_holder;//localStorage.getItem(("user_details_holder"));
        var trackers = user_data.trackers;


        trackers.forEach(element => {
            if(element.tracking_no == document.getElementById("tracking_no").value){
                sessionStorage.setItem("track_id", element.tracking_no);
                sessionStorage.setItem("status", element.status);
                sessionStorage.setItem("progress", "In Transit");
                sessionStorage.setItem("reciever_name", element.full_name);
                sessionStorage.setItem("reciever_addr", element.address);
                sessionStorage.setItem("progress_bar", element.progress);
                sessionStorage.setItem("status_color", element.color);
                sessionStorage.setItem("progress_color", element.color);
                sessionStorage.setItem("arrival_date", element.arrival_date);
                window.location = "track_page/track.html";
            }
        });
        document.getElementById("wrong_code_indicator").style.display = "block";
    }