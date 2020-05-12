import path from "path";
import express, { Express } from "express";
import WebSocket from "ws";

const players: any = {};

const app: Express = express();

app.use("/", express.static(path.join(__dirname, "../../Client/dist")));

app.listen(3000, () => {
  console.log("Server is ready on port 3000...");
});

const wsServer = new WebSocket.Server({ port: 8080 }, () => {
  console.log("BattleJong WebSocket server ready");
});

wsServer.on("connection", (socket: WebSocket) => {
  //Magic Happens here!!!

  console.log("Player connected");
  socket.on("message", (msg: string) => {
    const msgParts: string[] = msg.toString().split("_");
    const message: string = msgParts[0];
    const pid: string = msgParts[1];
    console.log(message);
    switch (message) {
      //Message Controller

      case "match":
        players[pid].score += parseInt(msgParts[2]);
        wsServer.clients.forEach(function each(client: WebSocket) {
          client.send(`update_${pid}_${players[pid].score}`);
        });
        break;
      case "done":
        players[pid].stillPlaying = false;
        let playersDone: number = 0;
        for (const player in players) {
          if (players.hasOwnProperty(player)) {
            if (!players[player].stillPlaying) playersDone++;
          }
        }
        if (playersDone === 2) {
          let winningPID: string;
          const pids: string[] = Object.keys(players);
          if (players[pids[0]].score > players[pids[1]].score)
            winningPID = pids[0];
          else winningPID = pids[1];

          wsServer.clients.forEach(function each(client: WebSocket) {
            client.send(`game_over_${winningPID}`);
          });
        }
        break;
    }
  });

  const pid: string = `pid${new Date().getTime()}`;
  players[pid] = { score: 0, stillPlaying: true };

  socket.send(`connected_${pid}`);
  if (Object.keys(players).length % 2 === 0) {
    const shuffledLayout: number[][][] = shuffle();
    wsServer.clients.forEach(function each(client: WebSocket) {
      client.send(`start_${JSON.stringify(shuffledLayout)}`);
    });
  }
});

const layout: number[][][] = [
  /* Layer 1. */
  [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  /* Layer 2. */
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  /* Layer 3. */
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  /* Layer 4. */
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  /* Layer 5. */
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
]; /* End layout. */

function shuffle(): number[][][] {
  const cl: number[][][] = layout.slice(0);

  let numWildCards: number = 0;

  const numTileTypes: number = 42;

  for (let i: number = 0; i < cl.length; i++) {
    const layer: number[][] = cl[i];
    for (let j: number = 0; j < layer.length; j++) {
      const row: number[] = layer[j];
      for (let k: number = 0; k < row.length; k++) {
        const tileVal: number = row[k];
        if (tileVal === 1) {
          row[k] = Math.floor(Math.random() * numTileTypes) + 101;
          if (row[k] === 101 && numWildCards === 3) {
            row[k] = 102;
          } else {
            numWildCards += numWildCards;
          }
        }
      }
    }
  }

  return cl;
}
