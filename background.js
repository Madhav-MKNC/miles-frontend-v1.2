// // update
// async function refreshClick(data) {
//   const response = await fetch("https://miles.gamhcrew.repl.co/refresh", {
//       method: "POST",
//       headers: {
//           "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//   });
//   const result = await response.json();
//   return result.status;
// }


// // main
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("click krna tha abhi")

//   // click.js
//   if (message.clicked) {
//     console.log("click ho gya bhai");

//     // Retrieve stored data
//     chrome.storage.local.get("miles2", function (result) {
//       let storedData = result["miles2"];

//       // Assuming otherUserLabel and chats are part of the message
//       let otherUserLabel = message.otherUser;
//       let chats = message.chats;

//       if (storedData.conversation_data[otherUserLabel]) {
//         storedData.conversation_data[otherUserLabel][3] = chats;
//       }

//       // update
//       const status = refreshClick(message);
//       console.log(status);

//       // Set the updated data
//       chrome.storage.local.set({ "miles2": JSON.stringify(storedData) }, function () {
//       });
//     });
//   }

//   // 
//   if (message.sendgoal) {
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, { goalText: message.goalText });
//     });
//   }
// });
