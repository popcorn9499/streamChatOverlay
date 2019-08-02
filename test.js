// let socket = new WebSocket("wss://localhost:8000");

// socket.onopen = function(e) {
//   alert("[open] Connection established, send -> server");
//   socket.send("My name is John");
// };

// socket.onmessage = function(event) {
//   alert(`[message] Data received: ${event.data} <- server`);
// };

// socket.onclose = function(event) {
//   if (event.wasClean) {
//     alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
//   } else {
//     // e.g. server process killed or network down
//     // event.code is usually 1006 in this case
//     alert('[close] Connection died');
//   }
// };

// socket.onerror = function(error) {
//   alert(`[error] ${error.message}`);
// };


// var WS_URL = "ws://localhost:8000";
//       function connect() {
//         console.log("attempting connection");

//         var ws = new WebSocket(WS_URL);
//         ws.onopen = function() {
//           console.log("connection open");
//           ws.send("hello");
//         };

//         ws.onmessage = function(event) {
//           console.log("received:");
//           console.log(event.data);
//               };

//         ws.onclose = function(e) {
//           console.log(
//             "Socket is closed. Reconnect will be attempted in 1 second.",
//             e.reason
//           );
//           setTimeout(function() {
//             connect();
//           }, 500);
//         };

//         ws.onerror = function(err) {
//           console.error(
//             "Socket encountered error: ",
//             err.message,
//             "Closing socket"
//           );
//           ws.close();
//         };
//       }

//       // start websocket
//       connect();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function addListNode(){
  var ul = document.getElementById("Chat");
  var li = document.createElement("li");
  li.className = "message";
  var time = "Time";
  var username = "Username";
  var message = "Message";
  var html = `
    <span class="timestamp"> ${time} </span>
    <span class="username"> ${username} </span>
    <span class="message-text"> ${message} </span>
  `;
  li.innerHTML = html;
  ul.appendChild(li);
  console.log("Added")
  await sleep(5000);
  ul.removeChild(li)
  console.log("Removed")
}

async function test(){
  while (true){
    console.log("HI");
    await sleep(2000);
  }
}

addListNode();
test()


