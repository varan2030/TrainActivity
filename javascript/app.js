
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAn37SI2e0D_2-FcITND_eivdMCc_ByLzc",
    authDomain: "timesheet-aa93b.firebaseapp.com",
    databaseURL: "https://timesheet-aa93b.firebaseio.com",
    projectId: "timesheet-aa93b",
    storageBucket: "timesheet-aa93b.appspot.com",
    messagingSenderId: "289629536595"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
  var trainCount = 0;
  
  // 2. Button for adding Trains
  $("#add-train-btn").on("click", function(event) {
    
    event.preventDefault();
  

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirstTime = moment($("#start-input").val().trim(),"hh:mm A").format("hh:mm A");
    console.log(trainFirstTime);
    var trainFrequency = $("#frequency-input").val().trim();
  
    if (trainName && trainDestination && trainFirstTime && trainFrequency){
    // Creates local "temporary" object for holding train data
        var newTrain = {
        name: trainName,
        destination: trainDestination,
        trainFirstTime: trainFirstTime,
        frequency: trainFrequency
        };
    
        // Uploads train data to the database
        database.ref().push(newTrain);
    
        // Logs everything to console
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.trainFirstTime);
        console.log(newTrain.frequency);
    
        // Alert
        alert("Train successfully added");
    
        // Clears all of the text-boxes
        $("#train-name-input").val("");
        $("#destination-input").val("");
        $("#start-input").val("");
        $("#frequency-input").val("");

        trainCount++;
    }
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  function getData(){
    
    $("td").remove();
    
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().trainFirstTime;
    var trainFrequency = childSnapshot.val().frequency;
  
    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFirstTime);
    console.log(trainFrequency);
  
    // Prettify the train start


    var firstTimeConverted = moment(trainFirstTime, "hh:mm A").subtract(1, "years");
    console.log(firstTimeConverted);
    

    var currentTime = moment();
    var presentTime = moment(currentTime).format("hh:mm A");
    console.log("CURRENT TIME: " + presentTime);


    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);


    // Minute Until Train
    var tMinutesTillTrain = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainTime = moment(nextTrain).format("hh:mm A")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
   
    var key = childSnapshot.key;
    console.log("Key " +key);
    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
    trainFrequency + "</td><td>" + nextTrainTime + "</td><td>" + tMinutesTillTrain + "</td><td>" +  
    "<button class = 'delete-train btn btn-primary' value ='" + key + "''>" + "Remove");
  });
}

getData();

setInterval(getData, 1000);

function showTime(){
    var currentTime = moment();
    $("#present-time").html((currentTime).format("hh:mm:ss A"));
}

setInterval(showTime,1000);

function hideForm() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
  
$(document).on("click", ".delete-train", function(){
    console.log($(this).attr("value"));
    keyref = $(this).attr("value");
   
    database.ref().child(keyref).remove();
    
})
  