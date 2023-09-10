function fetchMessages() {
    const chatElements = document.querySelectorAll(".copyable-text");
    const otherUserLabel = document.querySelector("._3W2ap") ? document.querySelector("._3W2ap").innerText : '';
    let thisUser = '';
    console.log("a1")
    const usernames = new Set();
    console.log("a2")

    const chats = Array.from(chatElements)
    .filter(element => element.getAttribute('data-pre-plain-text')) // Filter out elements with no 'data-pre-plain-text' attribute
    .map(element => {
            console.log("a2")
            const info = element.getAttribute('data-pre-plain-text');
            const usernameStartIndex = info.indexOf('] ') + 2;
            const usernameEndIndex = info.lastIndexOf(':');
            const username = info.slice(usernameStartIndex, usernameEndIndex);
            usernames.add(username); // Add username to a set

            const messageElement = element.querySelector('.selectable-text');
            const messageText = messageElement ? messageElement.innerText : '';

            // If the message is an outgoing message (from "You:"), then set the thisUser
            if (element.closest('.message-out')) {
                thisUser = username;
            }

            return {
                sender: username,
                message: messageText
            };
        });

    // If there are more than two users, including "thisUser", then it's a group chat
    const isGroup = usernames.size > 2;
    console.log("################")
    console.log(thisUser)
    console.log(otherUserLabel)
    console.log("################")
    return { thisUser, otherUserLabel, isGroup, chats };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.getScraped) {
        console.log('requested_scraped')
        const data = fetchMessages()
        console.log('sent: ')
        console.log(data)
        sendResponse(data);
    }
})

