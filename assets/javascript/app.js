  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA-_ksnuKCXR7v80gikVA2KZe095Hi8n1k",
    authDomain: "train-scheduler-ecdc8.firebaseapp.com",
    databaseURL: "https://train-scheduler-ecdc8.firebaseio.com",
    projectId: "train-scheduler-ecdc8",
    storageBucket: "train-scheduler-ecdc8.appspot.com",
    messagingSenderId: "410280194782",
    appId: "1:410280194782:web:3d4f69500f8f6bb3b1c84f",
    measurementId: "G-9R56R4YCPC"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var database = firebase.database();

console.log(database);

var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = 0;

// Sets and displays current date and time on page
function updateClock() {
  $("#currentDate").text(moment().format("MMMM Do YYYY HH:mm"));
  
  setTimeout(updateClock, 1000);
};

updateClock(); 

// Checks if string is empty
const isEmpty = function (str) {
  return str.trim() === '';
};

$("#submitButton").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#trainNameInput").val().trim();
  var destination = $("#destinationInput").val().trim();
  var firstTrain = $("#firstTrainInput").val().trim();
  var frequency = $("#frequencyInput").val().trim();

  const invalid = [trainName, destination, firstTrain, frequency].filter(isEmpty);

  if (invalid.length) {
    alert("Invalid Input")
    return;
  };

  database.ref().push({
    trainName,
    destination,
    firstTrain,
    frequency
  });

  console.log("hello")

  document.getElementById("myform").reset();

});


// Manipulates and displays data from Firebase
database.ref().on("child_added", function (snapshot) {
  console.log(snapshot.val());
  displaySchedule(snapshot);
});


function displaySchedule(snapshot) {


  let data = snapshot.val();

  // Frequency
  let tFrequency = data.frequency;

  // First train time
  let firstTime = data.firstTrain;

  // First Time (pushed back 1 year to make sure it comes before current time)
  let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  let currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  let tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  let nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  let time = firstTime;
  let frequency = tFrequency;
  let minToA = updateTrainTime(time, frequency);

  // Appends data to website
  var tableRow = $("<tr id='row'>").append(
    $("<td class='row_data'>").text(data.trainName),
    $("<td class='row_data text-center'>").text(data.destination),
    $("<td class='row_data text-center'>").text(data.frequency),
    $("<td class='arrTime text-center'>").text(moment(nextTrain).format("HH:mm")),
    $("<td class='mins text-center' id='tilTrain'> data-key=" + snapshot.key + "").text(tMinutesTillTrain),
    //+ "<td class='mins' data-key="+snapshot.key+">" + minToA +  "</td>",
    $("<td class='text-center'><i class='far fa-edit edit' id='editIcon'></i></td>"),
    $("<td class='text-center'><i class='far fa-save btn_save' id='saveIcon'></i></td>"),
    $("<td class='text-center'><i class='fas fa-eject btn_cancel' id='cancelIcon'></i></td>"),
    $("<td class='text-center'><i class='far fa-trash-alt trash' id='trashIcon' data-key=" + snapshot.key + "></i></tr>")
  );

  $("#trainTable").append(tableRow)

}
