document.addEventListener("DOMContentLoaded", function() {
    loadMessages();
});

function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message !== "") {
        addMessage(message);
        messageInput.value = "";
        saveMessages();
    }
}

function addMessage(message) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message";
    messageDiv.innerText = message;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = function() {
        chatBox.removeChild(messageDiv);
        saveMessages();
    };

    messageDiv.appendChild(deleteButton);
    chatBox.appendChild(messageDiv);
}

function saveMessages() {
    const messages = [];
    const messageElements = document.querySelectorAll(".message");
    
    messageElements.forEach(function(messageElement) {
        messages.push(messageElement.innerText);
    });

    localStorage.setItem("chatMessages", JSON.stringify(messages));
}

function loadMessages() {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];

    savedMessages.forEach(function(message) {
        addMessage(message);
    });
}

function clearMessages() {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    saveMessages();
}
