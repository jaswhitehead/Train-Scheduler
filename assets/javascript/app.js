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