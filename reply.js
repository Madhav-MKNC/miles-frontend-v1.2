function fetchMessages(sentgoal) {
    const chatElements = document.querySelectorAll(".copyable-text");
    const otherUserLabel = document.querySelector("._3W2ap") ? document.querySelector("._3W2ap").innerText : '';
    let thisUser = '';

    const usernames = new Set();

    const chats = Array.from(chatElements)
        .filter(element => element.getAttribute('data-pre-plain-text')) // Filter out elements with no 'data-pre-plain-text' attribute
        .map(element => {
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
    const goal = sentgoal;

    return { thisUser, otherUserLabel, isGroup, chats, goal };
}



async function sendToServer(data) {
    const response = await fetch("https://miles.gamhcrew.repl.co/get_reply", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.reply;
}

function placeSuggestedReply(reply) {
    const inputBar = document.querySelector("footer");
    const replyElement = document.createElement("div");
    replyElement.style.backgroundColor = "#1E1E26";
    replyElement.style.opacity = "100%";
    replyElement.style.borderRadius = "5px";
    replyElement.style.padding = "8px";
    replyElement.style.width = "60%";
    replyElement.style.height = "auto";
    replyElement.style.margin = "20px";
    replyElement.style.cursor = "pointer";
    replyElement.style.border = "1px solid rgba(255, 255, 255, 0.8)";
    replyElement.style.boxShadow = "0px 0px 10px rgba(214, 73, 107, 0.7)";
    replyElement.innerText = reply;
    inputBar.insertBefore(replyElement, inputBar.firstChild);
    replyElement.addEventListener("click", () => {
        navigator.clipboard.writeText(reply).then(
            function () {
                console.log("Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Could not copy text: ", err);
            }
        );
        replyElement.remove();
    });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.backup) {
        (async () => {
            console.log("reply.js started execution")
            const data = fetchMessages(message.goal);
            sendResponse(data);
            const reply = await sendToServer(data);
            console.log(reply)
            placeSuggestedReply(reply);
        })();
    }
});
