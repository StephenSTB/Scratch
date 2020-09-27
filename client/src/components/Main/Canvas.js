import React, {useRef,useEffect} from 'react';
import "./Main.css";

import scratchSurface from "../../logos/ScratchCard/ScratchSurface.png";


function Canvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerHeight, window.innerWidth)

        var img = new Image();
        img.src = scratchSurface;
        canvas.style.position = 'absolute';
        //canvas.style.border = '1px solid black';

        img.width = window.innerWidth * .7;
        img.height = window.innerHeight *.2;

        window.onresize = function () {
            img.width = window.innerWidth * .7;
            img.height = window.innerHeight *.2;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
    
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }

        var isPress = false;
        var old = null;

        canvas.addEventListener('mousedown', function (e){
            isPress = true;
            old = {x: e.offsetX, y: e.offsetY};
            console.log("pressed");
        });

        canvas.addEventListener('mousemove', function (e){
        if (isPress) {
            console.log("move");

            var x = e.offsetX;
            var y = e.offsetY;
            ctx.globalCompositeOperation = 'destination-out';

            ctx.beginPath();
            ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
            ctx.fill();

            ctx.lineWidth = 20;
            ctx.beginPath();
            ctx.moveTo(old.x, old.y);
            ctx.lineTo(x, y);
            ctx.stroke();

            old = {x: x, y: y};
        }
        });
        canvas.addEventListener('mouseup', function (e){
        isPress = false;
        });
                
    });

  return (
    <canvas
      ref = {canvasRef}
    />
  )
}
export default Canvas