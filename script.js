function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (message !== "") {
      const messagesContainer = document.getElementById("messages");
      const newMessage = document.createElement("p");
      newMessage.innerText = message;

      messagesContainer.insertBefore(newMessage, messagesContainer.firstChild);

      messageInput.value = "";
    }
  }