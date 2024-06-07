import React, { useEffect, useRef, useState } from "react";

function Draw() {
    const [brush, setBrush] = useState(true);
    const [elements, setElements] = useState({});
    const [elements2, setElements2] = useState({});
    const [line, setLine] = useState([]);
    const [rect, setRect] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [coor, setCoor] = useState({x: 0, y: 0});
    const [labelel, setLabelel] = useState([]);
    const [coord, setCoord] = useState([]);
    const ctx = useRef(null);

    const [counter, setCounter] = useState(0);
    
    useEffect(() => {
        const canvas = document.getElementById("mycanvas");
        ctx.current = canvas.getContext("2d");
        ctx.current.strokeStyle = "red";
        ctx.current.fillStyle = "red";
      }, []);
      
    const handleMouseDown = (e) => {
        setDrawing(true);
        var {clientX, clientY} = e;
        setCounter(counter + 1);
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        if(brush) {
            setElements2({x12: clientX - (offset.left), y12:clientY - (offset.top)});
        } else {
            setElements({x1: clientX - (offset.left), y1:clientY - (offset.top)});
        }
        if(showcoor) {
            ctx.current.font = "15px Arial";
            ctx.current.fillText(`${clientX-offset.left}, ${clientY-offset.top}`,clientX-offset.left, clientY-offset.top);
        }
    
    }
    const handleMouseUp = (e) => {
        setDrawing(false);
        if(brush) {
            setLine([...line, elements2]);
        } else {
            setRect([...rect, elements]);
        }
        const canvas = document.getElementById("mycanvas");
        var offset = canvas.getBoundingClientRect();
        if(brush) {
            var {x12,y12, x2, y2} = elements2;
            setCoord([...coord, {x1: x12, y1: y12, x2, y2}]);
            x12 += offset.left;
            x2 += offset.left;
            y12 += offset.top;
            y2 += offset.top;
            var xaxis = (x2+x12)/2;
            var yaxis = (y2+y12)/2;
        } else {
            var {x1,y1, x2: x2n, y2: y2n} = elements;
            setCoord([...coord, {x1, y1, x2: x2n, y2: y2n}]);
            x1 += offset.left;
            x2n += offset.left;
            y1 += offset.top;
            xaxis = (x2n+x1)/2;
            yaxis = y1
        }

        if(selectedLabel !== "") {
            setLabelel([...labelel, {id: counter, value: selectedLabel, x: xaxis - offset.left, y: yaxis - offset.top}]);
            ctx.current.font = "15px Arial";
            ctx.current.fillText(selectedLabel,xaxis-offset.left,yaxis-offset.top);
        }
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
            const newel = {x12,y12,x2: clientX - (offset.left),y2: clientY - (offset.top), id: counter, label: selectedLabel};
            ctx.current.clearRect(0,0,canvas.width,canvas.height);
            setElements2(newel);
            if(img) {
                ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
            const newel = {x1,y1,x2: clientX - (offset.left),y2: clientY - (offset.top), id: counter, label: selectedLabel};
            ctx.current.clearRect(0,0,canvas.width,canvas.height);
            setElements(newel);
            if(img) {
                ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
        if(showcoor) {
            ctx.current.font = "15px Arial";
            ctx.current.fillText(`${clientX-offset.left}, ${clientY-offset.top}`,clientX-offset.left, clientY-offset.top);
            if(brush) {
                ctx.current.fillText(`${x12}, ${y12}`, x12, y12);
            } else {
                ctx.current.fillText(`${x1}, ${y1}`, x1, y1);
            }
            [...coord].forEach(coord => {
                ctx.current.fillText(`${coord.x1}, ${coord.y1}`, coord.x1, coord.y1);
                ctx.current.fillText(`${coord.x2}, ${coord.y2}`, coord.x2, coord.y2);
            })
        }
        [...labelel].forEach(label => {
            ctx.current.font = "15px Arial";
            ctx.current.fillText(label.value, label.x, label.y);
        })
    }

    let [imgname, setImgname] = useState(null);

    let [img, setImg] = useState(null);
    const handleClick = (res) => {
        const canvas = document.getElementById("mycanvas");
        const outside = document.getElementById("outside");
        var file = res.target.files[0];
        setImgname(res.target.files[0].name);
        var img = new Image();
        img.onload = function() {
            outside.style.height = `${img.height}px`;
            outside.style.width = `${img.width}px`;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.current.clearRect(0,0,canvas.width,canvas.height);
            ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
            setCounter(0);
            setRect([]);
            setLine([]);
            setLabelel([]);
            setCoord([]);
            setImg(img);
        }
        img.src = URL.createObjectURL(file);
        var formData = new FormData();
        formData.append('file', file);
        fetch('http://127.0.0.1:5000/upload_and_replace', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    const remove = () => {
        const canvas = document.getElementById("mycanvas");
        setImg(null);
        ctx.current.clearRect(0,0,canvas.width,canvas.height);
        [...rect].forEach(rect => {
            ctx.current.strokeRect(rect.x1,rect.y1,rect.x2-rect.x1,rect.y2-rect.y1);
        });
        [...line].forEach(line => {
            ctx.current.beginPath();
            ctx.current.moveTo(line.x12,line.y12);
            ctx.current.lineTo(line.x2,line.y2);
            ctx.current.stroke();
        });
        if(showcoor) {
            [...coord].forEach(coord => {
                ctx.current.fillText(`${coord.x1}, ${coord.y1}`, coord.x1, coord.y1);
                ctx.current.fillText(`${coord.x2}, ${coord.y2}`, coord.x2, coord.y2);
            })
        }
        if(showlabel) {
            [...labelel].forEach(label => {
                ctx.current.font = "15px Arial";
                ctx.current.fillText(label.value, label.x, label.y);
            })
        }

    }

    const clearall = () => {
        const canvas = document.getElementById("mycanvas");
        ctx.current.clearRect(0,0,canvas.width,canvas.height);
        setRect([]);
        setLine([]);
        setCounter(0);
        setLabelel([]);
        setCoord([]);
        if(img) {
            ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
        }
    }

    const undo = () => {
        if(counter > 0) {
            const canvas = document.getElementById("mycanvas");
            if(line.length > 0 && rect.length > 0) {
                if((line[line.length -1].id > rect[rect.length -1].id)) {
                    line.pop();
                    setLine(line);
                    ctx.current.clearRect(0,0,canvas.width,canvas.height);
                    if(img) {
                        ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
                    ctx.current.clearRect(0,0,canvas.width,canvas.height);
                    if(img) {
                        ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
                    ctx.current.clearRect(0,0,canvas.width,canvas.height);
                    if(img) {
                        ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
                    ctx.current.clearRect(0,0,canvas.width,canvas.height);
                    if(img) {
                        ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
            var curlabel = labelel;
            curlabel.pop();
            setLabelel(curlabel);
            if(showlabel) {
                [...labelel].forEach(label => {
                    ctx.current.font = "15px Arial";
                    ctx.current.fillText(label.value, label.x, label.y);
                })
            }
            var coorcur = coord;
            coorcur.pop();
            setCoord(coorcur);
            if(showcoor) {
                [...coord].forEach(coord => {
                    ctx.current.fillText(`${coord.x1}, ${coord.y1}`, coord.x1, coord.y1);
                    ctx.current.fillText(`${coord.x2}, ${coord.y2}`, coord.x2, coord.y2);
                })
            }
            
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
        if(showcoor) {
            const canvas = document.getElementById("mycanvas");
            ctx.current.clearRect(0,0,canvas.width,canvas.height);
            if(img) {
                ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
            if(showlabel) {
                [...labelel].forEach(label => {
                    ctx.current.font = "15px Arial";
                    ctx.current.fillText(label.value, label.x, label.y);
                })
            }
        } else {
            [...coord].forEach(coord => {
                ctx.current.fillText(`${coord.x1}, ${coord.y1}`, coord.x1, coord.y1);
                ctx.current.fillText(`${coord.x2}, ${coord.y2}`, coord.x2, coord.y2);
            });
        }
        setShowcoor(!showcoor);
    }

    const [label, setLabel] = useState(false);
    const [labelcount, setLabelcount] = useState(0);

    const selectRef = useRef(null);

    const createlabel = () => {
        var newlabel = prompt("Enter label name: ");
        if(newlabel) {
            setLabel(newlabel);
            setLabelcount(labelcount + 1);
        }
    }

    useEffect(() => {
        if (label) {
            var opt = document.createElement('option');
            opt.id = label;
            opt.value = label;
            opt.innerHTML = label;
            // Use the ref instead of getElementById
            if (selectRef.current) {
                selectRef.current.appendChild(opt);
            }
        }
    }, [label]);

    const deletelabel = () => {
        if ((labelcount === 0) || selectedLabel === "") return;
        // var delete = prompt("")
        var selected = document.getElementById(selectedLabel);
        const select = document.getElementById("select");
        select.removeChild(selected);
        if(labelcount-1 === 0) {
            setLabel(false);
            setSelectedLabel("");
        }
        setLabelcount(labelcount - 1);
    }

    const [selectedLabel, setSelectedLabel] = useState("");

    const handleLabelChange = (e) => {
        if (e.target.value === selectedLabel) {
            setSelectedLabel("");
        } else {
            setSelectedLabel(e.target.value);
        }
    }

    const [showlabel, setShowlabel] = useState(true);

    const changelabel = () => {
        if(showlabel) {
            const canvas = document.getElementById("mycanvas");
            ctx.current.clearRect(0,0,canvas.width,canvas.height);
            if(img) {
                ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
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
            if(showcoor) {
                [...coord].forEach(coord => {
                    ctx.current.fillText(`${coord.x1}, ${coord.y1}`, coord.x1, coord.y1);
                    ctx.current.fillText(`${coord.x2}, ${coord.y2}`, coord.x2, coord.y2);
                });
            }
        } else {
            [...labelel].forEach(label => {
                ctx.current.font = "15px Arial";
                ctx.current.fillText(label.value, label.x, label.y);
            })
        }
        setShowlabel(!showlabel);
    }

    const downloadjson = () => {

        var json = {
            "image": imgname,
            "line": line,
            "rectangle": rect,
            "coordinates": coord,
            "label": labelel
        }

        var blob = new Blob([JSON.stringify(json)], {type: "text/plain"});
        var link = document.createElement('a');
        link.download = 'export.JSON';
        link.href = URL.createObjectURL(blob);
        link.click();
    }

    const updateimg = (images) => {
        var formData = new FormData();
        var file = new File([images], "imageName.png");
        formData.append('file', file);
        fetch('http://127.0.0.1:5000/upload_and_replace', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    const fetchdata = () => {
        var json = {
            "image": imgname,
            "line": line,
            "rectangle": rect,
            "coordinates": coord,
            "label": labelel
        }
        fetch('http://127.0.0.1:5000/replace_json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        fetch('http://127.0.0.1:5000/run_script')
        .then(response => response.blob())
        .then(
            images => {
            let url = URL.createObjectURL(images);
            const canvas = document.getElementById("mycanvas");
            const outside = document.getElementById("outside");
            var img = new Image();
            img.onload = function() {
                outside.style.height = `${img.height}px`;
                outside.style.width = `${img.width}px`;
                canvas.height = img.height;
                canvas.width = img.width;
                ctx.current.clearRect(0,0,canvas.width,canvas.height);
                ctx.current.drawImage(img,0,0,img.width,img.height,0,0,img.width,img.height);
                setCounter(0);
                setRect([]);
                setLine([]);
                setLabelel([]);
                setCoord([]);
                setImg(img);
                updateimg(images);
            }
            img.src = url;
            
        });
    }


    return(
        <div>
            <div class="menuflex">
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
                        <button class="btn btn-outline-primary btn-sm" onClick={changecoor}>{showcoor ? "Hide Coordinates" : "Show Coordinates"}</button>
                        <button class="btn btn-outline-primary btn-sm" onClick={changelabel}>{showlabel ? "Hide Labels" : "Show Labels"}</button>
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
                    <button class="btn btn-outline-success btn-sm" onClick={downloadjson}>Download JSON</button>
                    <button class="btn btn-outline-success btn-sm" onClick={fetchdata}>Identify Elements</button>
                    <h2>{coor.x},{coor.y}</h2>
                </div>
                <div>
                    <h2 style={{fontWeight: "bold", fontSize: "18px"}}>Select/Create a label:</h2>
                    <button onClick={createlabel} class="btn btn-primary btn-sm">Create new label</button>
                    <button onClick={deletelabel} id="delete" class="btn btn-primary btn-sm">Delete label</button>
                    <div class="menu">
                        {(label === false) ? <h1>You dont have any labels</h1> : <select select ref={selectRef} onChange={handleLabelChange} id="select" size="5">
                                        {/* <option onChange={handleLabelChange}>JAMES</option> */}
                                    </select> }
                    </div>
                </div>
            </div>
            <div id="outside">
                <div class="inside">
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
