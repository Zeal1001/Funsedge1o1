// ... (existing server code) ...

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.once('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === "login" && data.username) {
            console.log(`${data.username} logged in`);

            ws.username = data.username;
            loggedInClients.add(ws);

            ws.send(JSON.stringify({ text: `Welcome, ${data.username}!`, id: "system" }));

            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(JSON.stringify({ text: `${data.username} joined the chat.`, id: "system" }));
                }
            });

            chatHistory.forEach((message) => {
                ws.send(JSON.stringify(message));
            });

            ws.on('message', (message) => {
                const data = JSON.parse(message);

                if (data.type === "chat" && data.text && ws.username) {
                    // ... (existing chat message handling) ...
                } else if (data.type === "direct" && data.text && data.recipient && ws.username) {
                    const directMessage = {
                        text: data.text,
                        from: ws.username,
                        to: data.recipient,
                        id: "direct"
                    };

                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN && client.username === data.recipient) {
                            client.send(JSON.stringify(directMessage));
                        }
                    });

                    // Also send the direct message to the sender
                    ws.send(JSON.stringify(directMessage));
                }
            });

            ws.on('close', () => {
                console.log(`${ws.username} disconnected`);
                loggedInClients.delete(ws);

                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client !== ws) {
                        client.send(JSON.stringify({ text: `${ws.username} left the chat.`, id: "system" }));
                    }
                });
            });
        }
    });
});

// ... (existing server code) ...
