


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

async function fadeOut(object){
  var fadeTime = 1000; //time in ms
  var fadeCycleTime = 16; //time in ms per "frame"


  var curOpacity = window.getComputedStyle(object).getPropertyValue("opacity");
  var opacityChange = curOpacity/(fadeTime/fadeCycleTime);
  console.log("Fade out");

  while (object.style.opacity >= 0){
    curOpacity-=opacityChange
    object.style.opacity = curOpacity;
    await sleep(fadeCycleTime);
  }

}


async function addListNode(time,username,message){
  var ul = document.getElementById("Chat");
  var li = document.createElement("li");
  li.className = "message";
  var html = `
    <span class="timestamp"> ${time} </span>
    <span class="username"> ${username} </span>
    <span class="message-text"> ${message} </span>
  `;
  li.innerHTML = html;
  ul.appendChild(li);
  console.log("Added")
  await sleep(5000);
  await fadeOut(li);
  ul.removeChild(li)
  console.log("Removed")
}

async function main(){
  for (i = 0; i < 25; i++) { 
    var message = "BNLAHHH" + i;
    addListNode("WHY","User",message);
    await sleep(1000);
  }
}
main()



