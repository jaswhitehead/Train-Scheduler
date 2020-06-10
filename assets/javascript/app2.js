// Guarantees that the whole JS document only runs once the DOM is ready for JS to execute
$(document).ready(function(){

// Firebase database config snippet from the database's console tab
var firebaseConfig = {
    apiKey: "AIzaSyCvRBUu1WJ5Fu8OV0kBy806ZC86sWILono",
    authDomain: "train-scheduler-f501a.firebaseapp.com",
    databaseURL: "https://train-scheduler-f501a.firebaseio.com",
    projectId: "train-scheduler-f501a",
    storageBucket: "train-scheduler-f501a.appspot.com",
    messagingSenderId: "581021801870",
    appId: "1:581021801870:web:37bce3dd858ee24a9918df",
    measurementId: "G-3ZRMCPKECW"
  };

    //	Display Current Time
    function publishTime (){
        var currentTimeFormat = "MMMM Do YYYY, hh:mm:ss a";
        var currentTime = moment(moment(), currentTimeFormat);
        var currentTimeFormatted = currentTime.format(currentTimeFormat);
        $('#theTime').html(currentTimeFormatted)
        };

        setInterval(publishTime, 1000);


    // Firebase database initialization from the database's console tab
    firebase.initializeApp(firebaseConfig);

        // Global variables
        var database = firebase.database();
        var trainName = "";
        var destination = "";
        var firstTrainTime = "";
        var frequency = "";
        var minutesAway = "";
        var addedFirstTrain = "";
        var timeDifference = "";
        var remainingTime = "";
        var futureTrains = "";

        // Function that runs once the submit button is clicked to add a new train
        $("#submit-button").on("click", function() {
            event.preventDefault();

                // Grabs newly added train information and stores in variables 
                trainName = $("#trainName").val();
                console.log (trainName);

                destination = $("#destination").val();
                console.log (destination);

                firstTrainTime = $("#firstTrainTime").val();
                console.log (firstTrainTime);

                frequency = $("#frequency").val();
                console.log (frequency);

                    // Grabs the newly stored information and sends it to be stored in the database
                    database.ref().push( {
                        trainName: trainName,
                        destination: destination,
                        firstTrainTime: firstTrainTime,
                        frequency: frequency
                    });

                        // Alerts the user that the new train was successfully created 
                        alert ("Your train has been added!")

                            // Resets all input boxes
                            $("#trainName").val("");
                            $("#destination").val("");
                            $("#firstTrainTime").val("");
                            $("#frequency").val("");
        });

        // Determine all calculations to get the data ready to go into the table rows
        database.ref().on("child_added", function(childSnapshot) {

            addedFirstTrain = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract (1, "years");
            console.log (addedFirstTrain);

            timeDifference = moment().diff(moment(addedFirstTrain), "minutes");
            console.log (timeDifference);

            remainingTime = timeDifference % childSnapshot.val().frequency;
            console.log (remainingTime);

            minutesAway = childSnapshot.val().frequency - remainingTime;
            console.log (minutesAway);

            futureTrains = moment().add(minutesAway, "minutes");
            console.log (futureTrains);

            futureTrains = moment(futureTrains).format("hh:mm");
            console.log (futureTrains);

            // Add newly created train's data into the table rows
            $("#trainInfo").append("<tr><td>" + childSnapshot.val().trainName +
                "</td><td>" + childSnapshot.val().destination + "</td><td>" + childSnapshot.val().frequency + "</td><td>" + futureTrains + "</td><td>" + minutesAway + "</td></tr>");
        });
});