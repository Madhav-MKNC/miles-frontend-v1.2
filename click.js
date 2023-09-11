let localkey = "miles2";

/* Save the "self" user name */
function saveUserName(self_user) {
    const existingData = JSON.parse(localStorage.getItem(localkey)) || {
        conversation_data: {
            "test": ["chhatri leni hai", "chats", [0, 20, 40, 50, 60, 70, 80], ""],
        },
        toggleState: "",
        user_name: "",
    };

    existingData.user_name = self_user;
    localStorage.setItem(localkey, JSON.stringify(existingData));
    console.log("saving the username:", self_user)
}


/* Get the "self" user name */
function getUserName() {
    const data = localStorage.getItem(localkey);
    if (data) {
        try {
            const parsedData = JSON.parse(data);
            return parsedData.user_name;
        } catch (error) {
            console.error("Error parsing data from localStorage:", error);
            return "";
        }
    }
    return "";
}


/* main */
document.addEventListener('click', function () {
    console.log("bc click hua");

    // Add a small delay to ensure that the DOM has been updated
    setTimeout(function () {
        const chatElements = document.querySelectorAll(".copyable-text");
        const otherUser = document.querySelector("._3W2ap")
            ? document.querySelector("._3W2ap").innerText
            : "";
        let thisUser = getUserName() ? getUserName() : "";

        const usernames = new Set();

        const chats = Array.from(chatElements)
            .filter((element) => element.getAttribute("data-pre-plain-text")) // Filter out elements with no 'data-pre-plain-text' attribute
            .map((element) => {
                const info = element.getAttribute("data-pre-plain-text");

                // const username = info.trim().slice(20, -1);
                const usernameStartIndex = info.indexOf("] ") + 2;
                const usernameEndIndex = info.lastIndexOf(":");
                const username = info.slice(usernameStartIndex, usernameEndIndex);
                usernames.add(username); // Add username to a set

                const messageElement = element.querySelector(".selectable-text");
                const messageText = messageElement ? messageElement.innerText : "";

                // If the message is an outgoing message (from "You:"), then set the thisUser
                if (element.closest(".message-out")) {
                    thisUser = username;
                    saveUserName(thisUser);
                }

                return {
                    sender: username,
                    message: messageText,
                };
            });

        // If there are more than two users, including "thisUser", then it's a group chat
        const isGroup = usernames.size > 2;

        /*
        {
            thisUser: string,
            otherUser: string,
            isGroup: boolean,
            goal: string,
            preamble: string,
            chats: array
        }
        */

        // Send a message to the background.js
        chrome.runtime.sendMessage({
            clicked: true,
            thisUser: thisUser,
            otherUser: otherUser,
            isGroup: isGroup,
            chats: chats
        }, function (response) {
            console.log("Message sent");
            console.log(chats);
        });
    }, 1000); // 1000ms delay, you can adjust this value as needed
});
