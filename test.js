var messageDisapearDelay=15000; //time in ms

var fadeTransitionTime = 1000; //time in ms
var fadeCycleTime = 16; //time in ms per "frame"

var messageFormat = "%TimeAMPM% %Author% %Message%"

var WS_URL = "ws://localhost:8000";
function connect() {
  console.log("attempting connection");

  var ws = new WebSocket(WS_URL);
  ws.onopen = function() {
    console.log("connection open");
    ws.send("hello");
  };

  ws.onmessage = function(event) {
    console.log("received:");
    console.log(event.data);
    
  };

  ws.onclose = function(e) {
    console.log(
      "Socket is closed. Reconnect will be attempted in 1 second.",
      e.reason
    );
    setTimeout(function() {
      connect();
    }, 500);
  };

  ws.onerror = function(err) {
    console.error(
      "Socket encountered error: ",
      err.message,
      "Closing socket"
    );
    ws.close();
  };
}

// start websocket
connect();


function sleep(ms) { //sleep function
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async function fadein(object){
//   var fadeTime=2000; //time in ms
//   var curOpacity = object.style.opacity;

//   for (i = 0; i <; ){

//   }
// }

function formatAMPM(date){
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours > 12 ? "pm" : "am"; //give an am or pm suffice depending on the time
  hours = hours % 12 //since we have the am pm suffix truncate hours to max at 12
  minutes = minutes > 10 ? 0 + minutes : minutes; //forces minutes to always have 2 digits in it

  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function formatTime(date){ 
  var hours = date.getHours();
  var minutes = date.getMinutes();
  minutes = minutes > 10 ? 0 + minutes : minutes; //forces minutes to always have 2 digits in it
  var strTime = hours + ':' + minutes;
  return strTime;
}


async function fadeOut(object){ //adds a fadeout to the text
  var curOpacity = window.getComputedStyle(object).getPropertyValue("opacity");
  var opacityChange = curOpacity/(fadeTransitionTime/fadeCycleTime);
  console.log("Fade out");

  while (object.style.opacity >= 0){ //loops until the objects opacity is 0
    curOpacity-=opacityChange
    object.style.opacity = curOpacity;
    await sleep(fadeCycleTime); //delay in between opacity changes
  }
}


async function newMessage(username,message){
  var ul = document.getElementById("Chat");
  var li = document.createElement("li");
  var timeAMPM = formatAMPM(new Date());
  var time = formatTime(new Date());

  li.className = "message";

  var timeAMPMMsg = `<span class="timestamp"> ${timeAMPM} </span>`
  var times = `<span class="timestamp"> ${time} </span>`
  var AuthorMsg = `<span class="username"> ${username} </span>`
  var msg = `<span class="message-text"> ${message} </span>`

  var formatDictionary = {"%TimeAMPM%": timeAMPMMsg, "%Time%": times, "%Author%": AuthorMsg, "%Message%":msg}
  var html = messageFormat;
  for (var key in formatDictionary) {
    console.log(formatDictionary[key])
    html = html.replace(key,formatDictionary[key]);
  }

  li.innerHTML = html;
  ul.appendChild(li);
  console.log("Added")
  await sleep(messageDisapearDelay);
  await fadeOut(li);
  await sleep(100);
  ul.removeChild(li)
  console.log("Removed")
}

async function main(){
  for (i = 0; i < 7; i++) { 
    var message = "BNLAHHH aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + i;
    newMessage("User",message);
    await sleep(1000);
  }
}
main()
