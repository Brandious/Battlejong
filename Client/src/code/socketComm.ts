import React from 'react'

export function createSocketComm(parentComponent: React.Component)
{
    const connection: WebSocket = new WebSocket("ws://localhost:8080");

    connection.onopen = () => {
        console.log("Connection opened to server");
    }

    connection.onerror = error => {
        console.log(`WebSocket error: ${error}`);
    }

    connection.onmessage = function(message: any)
    {
        console.log(`WS received: ${message.data}`);

        const msgParts: string[] = message.data.split("_");
        const msg: string = msgParts[0];

        switch (msg) {
          case "connected":
            this.state.handleMessage_connected(msgParts[1]);
            break;
          case "start":
            this.state.handleMessage_start(JSON.parse(msgParts[1]));
            break;
          case "update":
            this.state.handleMessage_update(msgParts[1], parseInt(msgParts[2]));
            break;
          case "gameOver":
            this.state.handleMessage_gameOver(msgParts[1]);
            break;
        }

    }.bind(parentComponent);

    this.send = function(message: string)
    {
        console.log(`Sending message: ${message}`);
        connection.send(message);
    }

    return this;
}