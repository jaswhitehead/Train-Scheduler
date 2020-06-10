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
  var train1 = firebase.initializeApp(firebaseConfig, 'train1');
  firebase.analytics();

// Initializez Database
  var database = firebase.database();

  // CAPTURE BUTTON CLICK
    $(".submitButton").on("click",function(event) {
        event.preventDefault();
        console.log("Ready")
  
  //VALUES FOR EACH VARIABLE IN HTML
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrainTime = $("#firstTrainTime").val().trim();
        var frequency = parseInt($("#frequency").val().trim());
  
        var train = {
            trainName:trainName,
            destination:destination,
            firstTrainTime:firstTrainTime,
            frequency:frequency
  
        };
        database.ref().push(train)
        $(".form-control").val("");
  
  })

//ON CLICK CHILD FUNCTION
      database.ref().on("child_added",function(childSnapshot){
          
          var trainData = childSnapshot.val()
          var convertedFirstTrainTime = moment(trainData.firstTrainTime,"HH:mm");
          var difference = moment().diff(moment(convertedFirstTrainTime),"minutes");
          var timeRemaining = difference % trainData.frequency;db
          var minutesAway = trainData.frequency - timeRemaining;
          var nextArrival = moment().add(minutesAway,"minutes");
          nextArrival = moment(nextArrival).format("HH:mm");

          console.log("Name: " + trainName);
	        console.log("Destination: " + destination);
        	console.log("Time: " + firstTrainTime);
        	console.log("Frequency: " + frequency);

  
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
        })