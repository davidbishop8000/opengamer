var socket = new WebSocket("ws://cheesygame.ru/game");

socket.onopen = function (e) {
    console.log("[open] Соединение установлено");
    console.log("Отправляем данные на сервер");
    //socket.send("test");
    MessageAdd('<div class="message green">You have entered.</div>');
};

socket.onmessage = function (event) {
    console.log(`[message] Данные получены с сервера: ${event.data}`);
    //MessageAdd('<div class="message">' +  event.data + '</div>');
    let data = JSON.parse(event.data);
    if (data.type == "message") {
        MessageAdd('<div class="message">' + data.username + ': ' + data.message + '</div>');
    }
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
    } else {
        console.log('[close] Соединение прервано');
    }
    MessageAdd('<div class="message blue">You have been disconnected.</div>');
};

socket.onerror = function (error) {
    console.log(`[error]`);
    MessageAdd('<div class="message red">Connection to chat failed.</div>');
};

// on chat form submit:
document.getElementById("chat-form").addEventListener("submit", function (event) {
    event.preventDefault();

    var message_element = document.getElementsByTagName("input")[0];
    var message = message_element.value;

    if (message.toString().length) {
        var data = {
            type: "message",
            username: "You",
            message: message
        };

        socket.send(JSON.stringify(data));
        message_element.value = "";
    }
}, false);

// add message to chat:
function MessageAdd(message) {
    var chat_messages = document.getElementById("chat-messages");

    chat_messages.insertAdjacentHTML("beforeend", message);
    chat_messages.scrollTop = chat_messages.scrollHeight;
}
