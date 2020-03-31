import React, {Component, createRef} from 'react';
import './App.css';

class App extends Component {

    canvas = createRef();

    componentDidMount() {
        this.websocket = new WebSocket('ws://localhost:8000/canvas');

        this.websocket.onmessage = (message) => {
            try{
                const data = JSON.parse(message.data);

                if(data.type === 'PRINT_PIXEL'){
                    const Pixel = {
                        x: data.x,
                        y: data.y
                    };
                    
                    const canvasElement = this.canvas.current;
                    let ctx = canvasElement.getContext("2d");
                    
                    ctx.fillStyle = '#06386B';
                    ctx.fillRect(Pixel.x -5, Pixel.y - 5, 10, 10);
                    
                    ctx.stroke();
                    ctx.beginPath();
                } else if (data.type === 'LAST_PIXELS'){
                    data.pixels.forEach(pixel => {
                        const canvasElement = this.canvas.current;
                        let ctx = canvasElement.getContext("2d");

                        ctx.fillStyle = '#06386B';
                        ctx.fillRect(pixel.x -5, pixel.y - 5, 10, 10);

                        ctx.stroke();
                        ctx.beginPath();
                    });
                }
            } catch(e){
                console.error(e);
            }
        }
    }

    onCanvasClick = e => {
        const canvas = this.canvas.current;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const message = {type: 'PRINT_PIXEL', x, y};
        this.websocket.send(JSON.stringify(message));
    };

    render() {
        return (
            <div className="container">
                <h2 className="headline">Canvas</h2>
                <canvas width="1000px" height="500px" style={{backgroundColor: '#fff', borderRadius: "4px"}} ref={this.canvas} onClick={this.onCanvasClick}/>
            </div>
        );
    }
}

export default App;