var messageDisapearDelay=15000; //time in ms

var fadeTransitionTime = 1000; //time in ms
var fadeCycleTime = 16; //time in ms per "frame"


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
  var ampm = hours > 12 ? "pm" : "am";
  hours = hours % 12
  minutes = minutes > 10 ? 0 + minutes : minutes;

  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

async function fadeOut(object){
  var curOpacity = window.getComputedStyle(object).getPropertyValue("opacity");
  var opacityChange = curOpacity/(fadeTransitionTime/fadeCycleTime);
  console.log("Fade out");

  while (object.style.opacity >= 0){
    curOpacity-=opacityChange
    object.style.opacity = curOpacity;
    await sleep(fadeCycleTime);
  }
}


async function addListNode(username,message){
  var ul = document.getElementById("Chat");
  var li = document.createElement("li");
  var time = formatAMPM(new Date());
  li.className = "message";
  var html = `
    <span class="timestamp"> ${time} </span>
    <span class="username"> ${username} </span>
    <span class="message-text"> ${message} </span>
  `;
  li.innerHTML = html;
  ul.appendChild(li);
  console.log("Added")
  await sleep(messageDisapearDelay);
  await fadeOut(li);
  ul.removeChild(li)
  console.log("Removed")
}

async function main(){
  for (i = 0; i < 25; i++) { 
    var message = "BNLAHHH" + i;
    addListNode("User",message);
    await sleep(1000);
  }
}
main()



