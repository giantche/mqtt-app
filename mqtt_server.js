const aedes = require('aedes')();
const httpServer = require('http').createServer();
const ws = require('ws');

const wsServer = new ws.Server({ server: httpServer });
const port = 1883;
const wsPort = 8888; // WebSocket 連接的端口

// MQTT TCP Server
require('net').createServer(aedes.handle).listen(port, () => {
    console.log(`MQTT broker is running on port ${port}`);
});

// WebSocket Server for MQTT
wsServer.on('connection', (socket) => {
    const stream = require('stream');
    const duplex = new stream.Duplex({
        write: (chunk, encoding, callback) => {
            socket.send(chunk, encoding, callback);
        },
        read() {}
    });

    duplex.on('data', (chunk) => socket.send(chunk));
    socket.on('message', (msg) => duplex.push(msg));
    socket.on('close', () => duplex.push(null));

    aedes.handle(duplex);
});

httpServer.listen(wsPort, () => {
    console.log(`MQTT WebSocket server is running on ws://localhost:${wsPort}`);
});

aedes.on('client', (client) => {
    console.log(`Client connected: ${client.id}`);
});

aedes.on('publish', (packet, client) => {
    if (client) {
        console.log(`Message from ${client.id}: ${packet.payload.toString()}`);
    }
});
