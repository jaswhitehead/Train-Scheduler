//My app's Firebase configuration
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

// Initialize Firebase
    firebase.initializeApp(firebaseConfig);

// Initializes Database
    var database = firebase.database();

//	Display Current Time
    function publishTime (){
      var currentTimeFormat = "hh:mm:ss a";
      var currentTime = moment(moment(), currentTimeFormat);
      var currentTimeFormatted = currentTime.format(currentTimeFormat);
      $('#theTime').html('Current Time: ' + currentTimeFormatted)
      };

    setInterval(publishTime, 1000);

$(document).ready(function() {

// CAPTURE BUTTON CLICK
    $(".submitButton").on("click",function(event) {
        event.preventDefault();
        console.log("Ready")
  
//VALUES FOR EACH VARIABLE IN HTML
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var frequency = parseInt($("#frequency").val().trim());
    var firstTrainTime = $("#firstTrainTime").val().trim();    
  
//    var train = {
//      trainName:trainName,
//      destination:destination,
//      frequency:frequency,
//      firstTrainTime:firstTrainTime,      
//    };

    //Push to databse (new)
    database.ref().push({

			Name: trainName,
			Destination: destination,
			Freq: frequency,
			firstArrival: firstTrainTime,
			dateAdded: firebase.database.ServerValue.TIMESTAMP,
		});

		//clear form after submission:
		for (var i = 0; i < $('form').length; i++) {
			$('form')[i].reset();
		};

// Pushing to database (old)
//      database.ref().push(train)
//      $(".form-control").val("");
//    })

//ON CLICK CHILD FUNCTION
    database.ref().on("child_added",function(childSnapshot){
          
      var trainData = childSnapshot.val()
      // Difference between the current and firstTrain
      var convertedFirstTrainTime = moment(trainData.firstTrainTime,"HH:mm");
      var difference = moment().diff(moment(convertedFirstTrainTime),"minutes");
      var timeRemaining = difference % trainData.frequency;db
      // Minutes until next train
      var minutesAway = trainData.frequency - timeRemaining;
      // Next train time
      var nextArrival = moment().add(minutesAway,"minutes");
      nextArrival = moment(nextArrival).format("HH:mm");
  
//APPEND TO DISPLAY IN TRAIN TABLE
        $("#trainInfo").append(
              `
              <tr>
                      <td>${trainData.trainName}</td>
                      <td>${trainData.destination}</td>
                      <td>${trainData.frequency}</td>
                      <td>${nextArrival}</td>
                      <td>${minutesAway}</td>
              </tr>
              `
        )
     