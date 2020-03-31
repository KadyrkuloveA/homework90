const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const {nanoid} = require('nanoid');


const app = express();

expressWs(app);

app.use(cors());
app.use(express.json());

const port = 8000;
const connections = {};
const pixels = [];

app.ws('/canvas', function (ws) {

    const id = nanoid();
    connections[id] = ws;

    console.log('connected: ', Object.keys(connections).length);

    ws.send(JSON.stringify({
        type: 'LAST_PIXELS',
        pixels
    }));

    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        
        switch (data.type) {
            case 'PRINT_PIXEL':
                const Pixel = {
                    x: data.x,
                    y: data.y
                };

                Object.keys(connections).forEach(c => {
                    connections[c].send(JSON.stringify({
                        type: 'PRINT_PIXEL',
                        ...Pixel
                    }));
                });

                pixels.push(Pixel);

                break;
            default:
                console.log('NO TYPE: ', data.type);
        }
    });

    ws.on('close', (msg) => {
        delete connections[id];
    })
});

app.listen(port, () => {
    console.log(`HTTP Server life on http://localhost:${port}/`);
});