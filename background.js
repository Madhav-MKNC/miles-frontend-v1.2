chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.clicked) {
    console.log("c1");
    // Retrieve stored data
    chrome.storage.local.get("miles2", function(result) {
        let storedData = result.miles2;
        // Assuming otherUserLabel and chats are part of the message
        let otherUserLabel = message.otherUserLabel;
        console.log(chrome.storage.local.get("miles"));
        let chats = message.chats;

        if (storedData.conversation_data[otherUserLabel]) {
            console.log("c3");
            storedData.conversation_data[otherUserLabel][3] = chats;
        }
        console.log("c4");
        
        // Set the updated data
        chrome.storage.local.set({ "miles2": JSON.stringify(storedData) }, function() {
            console.log("c4");
        });
    });
}


  if (message.sendgoal) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { goalText: message.goalText });
    });
  }
});
