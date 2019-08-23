var messageDisapearDelay=-1; //time in ms. -1 disables
var fromBottomUp = "bottom"; //"bottom" to have text fill from the bottom. "top" to have text fill from the top


var fadeTransitionTime = 1000; //time in ms (set to 0 to disable)
var fadeCycleTime = 16; //time in ms per "frame"

var emojiWidth = "32";
var emojiHeight = "32";

var messageFormat = "%TimeAMPM% %ServiceIcon% %Server%:%Channel% %Author% %Message%"

var WS_URL = "ws://localhost:8000";
function connect() {
  console.log("attempting connection");

  var ws = new WebSocket(WS_URL);
  ws.onopen = function() {
    console.log("connection open");
    var data = ["ConnectDetails", [{"Service": "Discord", "Server": "Popicraft Network", "Channel": "test", "ServiceIcon": "[D]"},{"Service": "Youtube", "Server": "Youtube", "Channel": "Youtube", "ServiceIcon": "[Y]"},{"Service": "irc", "Server": "irc.chat.twitch.tv", "Channel": "#popcorn9499", "ServiceIcon": "[T]"}]]
    ws.send(JSON.stringify(data));
  };

  ws.onmessage = function(event) {
    console.log("received:");
    console.log(event.data);
    var data = JSON.parse(event.data); //this section will change this is temporary setup
    var fixMessage = addEmojis(data["Message"], data["Emojis"]);
    newMessage(data["Author"], fixMessage, ServiceIcon=data["ServiceIcon"],Server=data["Server"],Channel=data["Channel"]);

    ws.send("Me");
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


function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  // try{
  //   return str.replace(new RegExp(find, 'g'), replace);
  // } catch {
  //   return str.replace(find, replace);
  // }
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function sleep(ms) { //sleep function
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async function fadein(object){
//   var fadeTime=2000; //time in ms
//   var curOpacity = object.style.opacity;

//   for (i = 0; i <; ){

//   }
// }

function addEmojis(message,emojis){
  var fixMessage=message;
    for (var key in emojis){
      var url = emojis[key];
      console.log(url);
      var replace = `<img class="emojis" src="${url}" style="vertical-align:middle" alt="${key}">`;
      fixMessage = replaceAll(fixMessage,key,replace);
    }
    return fixMessage;
}

function formatAMPM(date){
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours > 12 ? "pm" : "am"; //give an am or pm suffice depending on the time
  hours = hours % 12 //since we have the am pm suffix truncate hours to max at 12
  minutes = minutes > 10 ? `0${minutes}` : minutes; //forces minutes to always have 2 digits in it

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


async function newMessage(username,message, ServiceIcon="",Server="",Channel=""){
  var ul = document.getElementById("Chat");
  
  var timeAMPM = formatAMPM(new Date());
  var time = formatTime(new Date()); 

  console.log(ServiceIcon)

  //fill in the formatting spaces we have
  var timeAMPMMsg = `<span class="timestamp"> ${timeAMPM} </span>`;
  var times = `<span class="timestamp"> ${time} </span>`;
  var ServiceIconMsg = `<span class="ServiceIcon"> ${ServiceIcon} </span>`;
  var ServerMsg = `<span class="Server"> ${Server} </span>`;
  var ChannelMsg = `<span class="Channel"> ${Channel} </span>`;
  var AuthorMsg = `<span class="username"> ${username} </span>`;
  var msg = `<span class="message-text"> ${message} </span>`;

  var formatDictionary = {"%TimeAMPM%": timeAMPMMsg, "%Time%": times,"%ServiceIcon%": ServiceIconMsg,"%Server%": ServerMsg,"%Channel%": ChannelMsg, "%Author%": AuthorMsg, "%Message%":msg};
  var html = messageFormat;
  for (var key in formatDictionary) {
    console.log(formatDictionary[key]);
    html = html.replace(key,formatDictionary[key]);
  }

  var li = document.createElement("li");
  li.className = "message";
  li.innerHTML = html;
  ul.appendChild(li);
  console.log("Added")
  if (messageDisapearDelay > -1){
    await sleep(messageDisapearDelay); //delay in between message on screen and fadeout and removal
    if (fadeTransitionTime != 0){ //fade out section with 0 diabling it
      await fadeOut(li);
      await sleep(100);
    }
    ul.removeChild(li)
    console.log("Removed")
  }
}

function bottomTopListAlignment() {
  if (fromBottomUp == "bottom"){
    var element = document.getElementById("ChatControls");
    element.classList.add("messageOrder");
  }
}
bottomTopListAlignment()

// async function main(){ //temp code that will be gone when we add the websocket
//   for (i = 0; i < 7; i++) { 
//     var message = "BNLAHHH aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" + i;
//     newMessage("User",message);
//     await sleep(1000);
//   }
// }
// main()
