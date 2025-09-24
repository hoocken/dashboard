'use client';
import React, { useRef, useState, useEffect } from 'react';
import styles from './whiteboard.module.css';


export default function Whiteboard() {
    // From https://www.youtube.com/watch?v=p3jJ5z7i3KE
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [drawingActions, setDrawingActions] = useState([]);
    const [lineWidth, setLineWidth] = useState(20);
    const [currentPath, setCurrentPath] = useState([]);
    const [currentStyle, setCurrentStyle] = useState({color: 'black', lineWidth: 3});
    const [rngNumber, setRngNumber] = useState(0);

    // UseEffect initializes the Whiteboard.
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = 500;
            canvas.height = 500;
            
            const ctx = canvas.getContext('2d')
            setContext(ctx);
            // reDrawPreviousData(ctx);
            pickRandomNumber();
        }
    }, []);

    const draw = (e) => {
        if (!drawing || !context) return;
        const { offsetX, offsetY } = e.nativeEvent;
        context.lineWidth = lineWidth;
        context.lineTo(offsetX, offsetY);
        context.stroke();
    }

    const startDrawing = (e) => {
        if (context) {
            const { offsetX, offsetY } = e.nativeEvent;
            context.beginPath();
            context.moveTo(offsetX, offsetY);
            setDrawing(true);
        };
    };

    const stopDrawing = () => {
        setDrawing(false);
        if (context) {
            context.closePath();
        }
    }

    const clearDrawing = () => {
        setCurrentPath([]);
        const newContext = canvasRef.current.getContext('2d');
        newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const sendImage = async () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            const formData = new FormData();
            formData.append('file', dataURL);
            formData.append('number', rngNumber);
            const resp = await fetch('http://localhost:5050/api/send-image', {
            method: 'POST',
            body: formData,
            // Content-Type header is automatically set to multipart/form-data by FormData
            })
            clearDrawing();
            pickRandomNumber();
        }
    }

    const pickRandomNumber = () => {
        const min = 0;
        const max = 9;
        const num = Math.floor(Math.random() * (max - min + 1) + min);

        setRngNumber(num);
    }


    return (
        <div>
            <p>Draw this number: {rngNumber}</p>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={styles.whiteboard}
            />
            <div className={styles.divbutton}>
                <button 
                    className={styles.button}
                    onClick={clearDrawing}
                >
                    Clear Canvas
                </button>
                <button 
                    className={styles.button}
                    onClick={sendImage}
                >
                    Send
                </button>
            </div>
        </div>
    )

}