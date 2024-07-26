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
    var create_or_edit;


    constructor();
    function constructor(){
        get_data_from_database();
        // THIS REGISTER METHOD IS ONLY TO CREATE USER IN THE DB
        // register();
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
    function create_tracking_info(){
        create_or_edit = "create";
        document.getElementById("get_email_block").style.display = "none";
        document.getElementById("display_fields_block").style.display = "block";
        var generated_tracking_no = randomStr();
        document.getElementById("tracking_no").value = generated_tracking_no;
    }
    function edit_tracking_info(){
        create_or_edit = "edit";
        if(user_details_holder != undefined){
            var tracking_to_find = document.getElementById("get_email_input").value;
            var data1, temp = user_details_holder.trackers;
            temp.forEach(element => {
                if(element.tracking_no == tracking_to_find){
                    data1 = element;
                    document.getElementById("get_email_block").style.display = "none";
                    document.getElementById("display_fields_block").style.display = "block";
                    
                    document.getElementById("tracking_no").value = tracking_to_find;
                    document.getElementById("full_name").value = data1.full_name;
                    document.getElementById("date").value = data1.arrival_date;
                    document.getElementById("address").value = data1.address;
                    document.getElementById("status").value = data1.status;
                    selectElement('progress_bar', data1.progress);
                    selectElement('color', data1.color);
                }
            });
            if(data1 == undefined){
                alert("Not found!");
            }
        }
    }

    function sendToDatabase(){
        if(document.getElementById("full_name").value == "" || document.getElementById("tracking_no").value == "" || document.getElementById("date").value == "" || document.getElementById("address").value == "" || document.getElementById("status").value == ""){
            alert("Please fill in all the boxes");
        } else{
            var trackers = [];
            var data = {
                full_name : document.getElementById("full_name").value,
                tracking_no : document.getElementById("tracking_no").value,
                arrival_date : document.getElementById("date").value,
                address : document.getElementById("address").value,
                status : document.getElementById("status").value,
                color : document.getElementById("color").value,
                progress : document.getElementById("progress_bar").value
            }

            if(create_or_edit == "create"){
                trackers = user_details_holder.trackers;
                trackers.push(data);
            }
            if(create_or_edit == "edit"){
                user_details_holder.trackers.forEach(element => {
                    if(element.tracking_no == data.tracking_no){
                        trackers.push(data);
                    } else{
                        trackers.push(element);
                    }
                });
            }

            user_details_holder.trackers = trackers;
            show_loader();
            updateDatabase();
        }
    }
    function updateDatabase(){
        var user = auth.currentUser
        var database_ref = database.ref()
        auth.signInWithEmailAndPassword("tracker@gmail.com", "Tracker123")
        .then(function() {

        database_ref.child('users/' + user.uid).update(user_details_holder)
            setTimeout(show_updated, 2000);
        })
        .catch(function(error) {
            var error_message = error.message;
            alert(error_message);
        })
    }
    function show_updated(){
        hide_loader();
        alert("Information Updated!")
    }


    
    function show_loader(){
        document.getElementById("divElement").style.display = "block";
        document.getElementById("get_email_block").style.display = "none";
        document.getElementById("display_fields_block").style.visibility = "hidden";
    }
    function hide_loader(){
        document.getElementById("display_fields_block").style.visibility = "visible";
        document.getElementById("divElement").style.display = "none";
    }
    function randomStr() {
        // let len = 12, arr = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', ans = '';
        let len = 12, arr = '1234567890', ans = '';
        for (let i = len; i > 0; i--) {
            ans += arr[(Math.floor(Math.random() * arr.length))];
        }
        return "G" + ans;
    }
    function copy_tracking(){
        var copyText = document.getElementById("tracking_no");
        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);
        // Alert the copied text
        alert("Copied!");
    }
    function selectElement(id, valueToSelect) {    
        let element = document.getElementById(id);
        element.value = valueToSelect;
    }



    function register() {
        // Move on with Auth
        auth.createUserWithEmailAndPassword("tracker@gmail.com", "Tracker123")
        .then(function() {
            var user = auth.currentUser

            // Add this user to database
            var database_ref = database.ref()

            var data = {
                full_name : "John Doe",
                tracking_no : "LSDJFJ3O4F3JFOJEF2",
                arrival_date : "Friday, June 2, 2023",
                address : "2038 hwy road",
                color : "green",
                status : "This is the status sample",
                progress : "status_1"
            }
            let temp = [];
            temp.push(data);
            // Create User data
            var user_data = {
                trackers : temp
            }

            database_ref.child('users/' +user.uid).set(user_data)
            setTimeout(showDoneMsg, 2000)

        })
        .catch(function(error){
            var error_code = error.code;
            var error_message = error.message;

            alert(error_message)
        })
    }
    function showDoneMsg(){
       alert("Done");
    }