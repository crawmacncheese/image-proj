import React, { useEffect, useRef, useState } from "react";

function Draw() {
    const [brush, setBrush] = useState(true);
    const [elements, setElements] = useState({});
    const [elements2, setElements2] = useState({});
    const [line, setLine] = useState([]);
    const [rect, setRect] = useState([]);
    const [drawing, setDrawing] = useState(false);

    const ctx = useRef(null);

    const [counter, setCounter] = useState(0);
    
    useEffect(() => {
        const canvas = document.getElementById("mycanvas");
        ctx.current = canvas.getContext("2d");
      }, []);
      
    const handleMouseDown = (e) => {
        setDrawing(true);
        var {pageX, pageY} = e;
        setCounter(counter + 1);
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        if(brush) {
            setElements2({x12: pageX - (offset.left), y12:pageY - (offset.top)});
        } else {
            setElements({x1: pageX - (offset.left), y1:pageY - (offset.top)});
        }
        
    }
    const handleMouseUp = (e) => {
        setDrawing(false);
        if(brush) {
            setLine([...line, elements2]);
        } else {
            setRect([...rect, elements]);
        }

    }
    const handleMouseMove = (e) => {
        if(!drawing) return;
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        var {pageX,pageY} = e;
        if(brush) {
            var {x12,y12} = elements2;
            const newel = {x12,y12,x2: pageX - (offset.left),y2: pageY - (offset.top), z: counter};
            ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
            setElements2(newel);
            [...line, newel].forEach(line => {
                ctx.current.beginPath();
                ctx.current.moveTo(line.x12,line.y12);
                ctx.current.lineTo(line.x2,line.y2);
                ctx.current.stroke();
            });
            [...rect].forEach(rect => {
                ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
            });
        } else {
            var {x1,y1} = elements;
            const newel = {x1,y1,x2: pageX - (offset.left),y2: pageY - (offset.top), z: counter};
            ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
            setElements(newel);
            [...rect, newel].forEach(rect => {
                ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
            });
            [...line].forEach(line => {
                ctx.current.beginPath();
                ctx.current.moveTo(line.x12,line.y12);
                ctx.current.lineTo(line.x2,line.y2);
                ctx.current.stroke();
            });
            }

    }

    let [image, setImage] = useState("");
    const handleClick = (res) => {
        var reader = new FileReader();
        reader.readAsDataURL(res.target.files.item(0));
        reader.onload = function() {
            var base64data = reader.result;
            setImage(base64data);
        };
    }

    const clearall = () => {
        ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
        setRect([]);
        setLine([]);
        setCounter(0);
    }

    const undo = () => {
        if(counter > 0) {
            if(line.length > 0 && rect.length > 0) {
                if((line[line.length -1].z > rect[rect.length -1].z)) {
                    line.pop();
                    setLine(line);
                    ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
                    [...rect].forEach(rect => {
                        ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
                    });
                    [...line].forEach(line => {
                        ctx.current.beginPath();
                        ctx.current.moveTo(line.x12,line.y12);
                        ctx.current.lineTo(line.x2,line.y2);
                        ctx.current.stroke();
                    });
                } else {
                    rect.pop();
                    setRect(rect);
                    ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
                    [...rect].forEach(rect => {
                        ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
                    });
                    [...line].forEach(line => {
                        ctx.current.beginPath();
                        ctx.current.moveTo(line.x12,line.y12);
                        ctx.current.lineTo(line.x2,line.y2);
                        ctx.current.stroke();
                    });
                }

            } else if(line.length > 0) {
                line.pop();
                    setLine(line);
                    ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
                    [...rect].forEach(rect => {
                        ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
                    });
                    [...line].forEach(line => {
                        ctx.current.beginPath();
                        ctx.current.moveTo(line.x12,line.y12);
                        ctx.current.lineTo(line.x2,line.y2);
                        ctx.current.stroke();
                    });
            } else if(rect.length > 0) {
                rect.pop();
                    setRect(rect);
                    ctx.current.clearRect(0,0,window.innerWidth,window.innerHeight);
                    [...rect].forEach(rect => {
                        ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
                    });
                    [...line].forEach(line => {
                        ctx.current.beginPath();
                        ctx.current.moveTo(line.x12,line.y12);
                        ctx.current.lineTo(line.x2,line.y2);
                        ctx.current.stroke();
                    });
            }
            setCounter(counter - 1);
        }
        
    }


    const setBrushTrue = () => {
        setBrush(true);

    }

    const setBrushFalse = () => {
        setBrush(false);

    }

    const setimg = () => {
        setImage("");
    }


    return(
        <div>
            <form action="/action_page.php">
                    <label for="myfile">Upload an image:  </label>
                    <input type="file" onChange={handleClick}/>
            </form>
            <div>
                <button class="btn btn-danger btn-sm" disabled={brush} onClick={setBrushTrue}>Line</button>
                <button class="btn btn-danger btn-sm" disabled={!brush} onClick={setBrushFalse}>Rectangle</button>
            </div>
            <div>
                <button class="btn btn-outline-primary btn-sm" onClick={clearall}>
                    Clear All
                </button>
                <button class="btn btn-outline-primary btn-sm"onClick={undo}>
                    Undo
                </button>
                <button class="btn btn-outline-primary btn-sm" onClick={setimg}>Remove Image</button>
            </div>
            <div class="outside">
                <div class="inside">
                    {image && <img src={image} alt="" class="covered"/>}
                    <canvas id="mycanvas" class="covering" 
                            width={window.innerWidth*0.8} 
                            height={window.innerHeight*0.8}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}>Canvas</canvas>
                </div>
                
            </div>
        </div>
    )
}

export default Draw;
