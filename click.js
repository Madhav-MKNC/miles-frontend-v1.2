document.addEventListener('click', function () {
    console.log("bc click hua");

    // Add a small delay to ensure that the DOM has been updated
    setTimeout(function () {
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

        // Send a message to the background script
        chrome.runtime.sendMessage({ clicked: true, chats: chats, otherUserLabel: otherUserLabel }, function (response) {
            console.log("Message sent");
            console.log(chats);
        });
    }, 1000); // 1000ms delay, you can adjust this value as needed
});
