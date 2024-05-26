import React, { useEffect, useRef, useState } from "react";

function Draw() {
    const [brush, setBrush] = useState(true);
    const [elements, setElements] = useState({});
    const [elements2, setElements2] = useState({});
    const [line, setLine] = useState([]);
    const [rect, setRect] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [coor, setCoor] = useState({x: 0, y: 0});

    const ctx = useRef(null);

    const [counter, setCounter] = useState(0);
    
    useEffect(() => {
        const canvas = document.getElementById("mycanvas");
        ctx.current = canvas.getContext("2d");
      }, []);
      
    const handleMouseDown = (e) => {
        setDrawing(true);
        var {clientX, clientY} = e;
        setCounter(counter + 1);
        const move = document.getElementById("move1");
        move.style.left = `${clientX}px`;
        move.style.top = `${clientY}px`;
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        if(brush) {
            setElements2({x12: clientX - (offset.left), y12:clientY - (offset.top)});
        } else {
            setElements({x1: clientX - (offset.left), y1:clientY - (offset.top)});
        }

        const move1 = document.getElementById("move1");
        move1.style.left = `${clientX - offset.left}px`;
        move1.style.top = `${clientY - offset.top}px`;
        setMove1(clientX + "," + clientY); 
    
    }
    const handleMouseUp = (e) => {
        setDrawing(false);
        if(brush) {
            setLine([...line, elements2]);
        } else {
            setRect([...rect, elements]);
        }
        setMove1("");
        setMove2("");
    }
    const handleMouseMove = (e) => {
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        if(!drawing) {
            setCoor({x:e.clientX - offset.left, y: e.clientY - offset.top});
            return;
        }
        var {clientX,clientY} = e;
        setCoor({x:e.clientX - offset.left, y: e.clientY - offset.top});
        if(brush) {
            var {x12,y12} = elements2;
            const newel = {x12,y12,x2: clientX - (offset.left),y2: clientY - (offset.top), z: counter};
            ctx.current.clearRect(0,0,800,800);
            setElements2(newel);
            if(img) {
                var hr = canvas.width / img.width;
                var vr = canvas.height / img.height;
                var ratio = Math.min(hr,vr);
                var cx = (canvas.width - img.width*ratio)/2;
                var cy = (canvas.height - img.height*ratio)/2;
                ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
                
            } 
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
            const newel = {x1,y1,x2: clientX - (offset.left),y2: clientY - (offset.top), z: counter};
            ctx.current.clearRect(0,0,800,800);
            setElements(newel);
            if(img) {
                hr = canvas.width / img.width;
                vr = canvas.height / img.height;
                ratio = Math.min(hr,vr);
                cx = (canvas.width - img.width*ratio)/2;
                cy = (canvas.height - img.height*ratio)/2;
                ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
            }
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
        const move = document.getElementById("move2");
        move.style.left = `${clientX - offset.left}px`;
        move.style.top = `${clientY - offset.top}px`;
        setMove2(clientX + "," + clientY);
    }

    let [img, setImg] = useState(null);
    const handleClick = (res) => {
        const canvas = document.getElementById("mycanvas");
        var file = res.target.files[0];
        var img = new Image();
        img.onload = function() {
            var hr = canvas.width / img.width;
            var vr = canvas.height / img.height;
            var ratio = Math.min(hr,vr);
            var cx = (canvas.width - img.width*ratio)/2;
            var cy = (canvas.height - img.height*ratio)/2;
            ctx.current.clearRect(0,0,800,800);
            ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
            [...rect].forEach(rect => {
                ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
            });
            [...line].forEach(line => {
                ctx.current.beginPath();
                ctx.current.moveTo(line.x12,line.y12);
                ctx.current.lineTo(line.x2,line.y2);
                ctx.current.stroke();
            });
            setImg(img);
        }
        img.src = URL.createObjectURL(file);
    }

    const remove = () => {
        setImg(null);
        ctx.current.clearRect(0,0,800,800);
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

    const clearall = () => {
        ctx.current.clearRect(0,0,800,800);
        const canvas = document.getElementById("mycanvas");
        setRect([]);
        setLine([]);
        setCounter(0);
        if(img) {
            var hr = canvas.width / img.width;
            var vr = canvas.height / img.height;
            var ratio = Math.min(hr,vr);
            var cx = (canvas.width - img.width*ratio)/2;
            var cy = (canvas.height - img.height*ratio)/2;
            ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
        }
    }

    const undo = () => {
        if(counter > 0) {
            const canvas = document.getElementById("mycanvas");
            if(line.length > 0 && rect.length > 0) {
                if((line[line.length -1].z > rect[rect.length -1].z)) {
                    line.pop();
                    setLine(line);
                    ctx.current.clearRect(0,0,800,800);
                    if(img) {
                        var hr = canvas.width / img.width;
                        var vr = canvas.height / img.height;
                        var ratio = Math.min(hr,vr);
                        var cx = (canvas.width - img.width*ratio)/2;
                        var cy = (canvas.height - img.height*ratio)/2;
                        ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
                    }
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
                    ctx.current.clearRect(0,0,800,800);
                    if(img) {
                        hr = canvas.width / img.width;
                        vr = canvas.height / img.height;
                        ratio = Math.min(hr,vr);
                        cx = (canvas.width - img.width*ratio)/2;
                        cy = (canvas.height - img.height*ratio)/2;
                        ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
                    }
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
                    ctx.current.clearRect(0,0,800,800);
                    if(img) {
                        hr = canvas.width / img.width;
                        vr = canvas.height / img.height;
                        ratio = Math.min(hr,vr);
                        cx = (canvas.width - img.width*ratio)/2;
                        cy = (canvas.height - img.height*ratio)/2;
                        ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
                    }
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
                    ctx.current.clearRect(0,0,800,800);
                    if(img) {
                        hr = canvas.width / img.width;
                        vr = canvas.height / img.height;
                        ratio = Math.min(hr,vr);
                        cx = (canvas.width - img.width*ratio)/2;
                        cy = (canvas.height - img.height*ratio)/2;
                        ctx.current.drawImage(img,0,0,img.width,img.height,cx,cy,img.width*ratio,img.height*ratio);
                    }
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


    const download = () => {
        const canvas = document.getElementById("mycanvas");
        var link = document.createElement('a');
        link.download = 'download.png';
        link.href = canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
        link.click();
    }

    const [showcoor, setShowcoor] = useState(true);
    const changecoor = () => {
        var james = showcoor;
        setShowcoor(!james);
    }

    const [move1, setMove1] = useState("");
    const [move2, setMove2] = useState("");


    return(
        <div>
            <form action="/action_page.php">
                    <label for="myfile">Upload an image:  </label>
                    <input type="file" onChange={handleClick}/>
            </form>
            <div>
                <button class="btn btn-danger btn-sm" disabled={brush} onClick={setBrushTrue}>Line</button>
                <button class="btn btn-danger btn-sm" disabled={!brush} onClick={setBrushFalse}>Rectangle</button>
                <button class="btn btn-outline-primary btn-sm" onClick={changecoor}>{showcoor ? "Hide Coordinates" : "Show Coordinates"}</button>
            </div>
            <div>
                <button class="btn btn-outline-primary btn-sm" onClick={clearall}>
                    Clear All
                </button>
                <button class="btn btn-outline-primary btn-sm"onClick={undo}>
                    Undo
                </button>
                <button class="btn btn-outline-primary btn-sm" onClick={remove}>Remove Image</button>

            </div>
            <button class="btn btn-outline-success btn-sm" onClick={download}>Download Canvas</button>
            <h2>{coor.x},{coor.y}</h2>
            <div class="outside">
                <div class="inside">
                    {showcoor && <div id="move1">{move1}</div>}
                    {showcoor && <div id="move2">{move2}</div>}
                    <canvas id="mycanvas" class="covering" 
                            width= "800px"
                            height= "800px"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}>Canvas</canvas>
                </div>
            </div>
        </div>
    )
}

export default Draw;
