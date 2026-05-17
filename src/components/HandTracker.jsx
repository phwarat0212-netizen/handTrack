import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index Finger
  [9, 10], [10, 11], [11, 12],     // Middle Finger
  [13, 14], [14, 15], [15, 16],    // Ring Finger
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky Finger
  [5, 9], [9, 13], [13, 17]        // Palm / Knuckles
];

const HandTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);
  
  const [handLandmarker, setHandLandmarker] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugStatus, setDebugStatus] = useState("Initializing...");
  
  // State for UI
  const [selectedColor, setSelectedColor] = useState('#00f2ff');
  const [hoverTarget, setHoverTarget] = useState(null);
  const [hoverProgress, setHoverProgress] = useState(0);

  // Refs for Animation Loop
  const selectedColorRef = useRef('#00f2ff');
  const lastPointRef = useRef(null);
  const requestRef = useRef();
  const hoverProgressRef = useRef(0);
  const hoverTargetRef = useRef(null);
  const smoothedPointRef = useRef(null);

  const colors = [
    { name: 'Cyan', hex: '#00f2ff' },
    { name: 'Pink', hex: '#ff0055' },
    { name: 'Yellow', hex: '#ffe600' },
    { name: 'Green', hex: '#00ff88' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Clear', hex: 'CLEAR' },
  ];

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    const initializeModels = async () => {
      try {
        setDebugStatus("Loading AI Models...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const handModel = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { 
            modelAssetPath: "hand_landmarker.task", 
            delegate: "GPU" 
          },
          runningMode: "video",
          numHands: 1,
        });
        setHandLandmarker(handModel);
        setDebugStatus("AI Ready.");
        setIsLoading(false);
      } catch (error) {
        setDebugStatus("AI Error: " + error.message);
        setIsLoading(false);
      }
    };
    initializeModels();
    return () => {
      if (handLandmarker) handLandmarker.close();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 360 },
          facingMode: "user"
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraReady(true);
          setDebugStatus("Active");
        };
      }
    } catch (error) {
      setDebugStatus("Camera Error");
    }
  };

  const clearCanvas = () => {
    if (!drawingCanvasRef.current) return;
    const ctx = drawingCanvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
  };

  const isPointing = (hand) => {
    const indexExtended = hand[8].y < hand[6].y;
    const middleFolded = hand[12].y > hand[10].y - 0.05;
    const ringFolded = hand[16].y > hand[14].y - 0.05;
    const pinkyFolded = hand[20].y > hand[18].y - 0.05;
    return indexExtended && middleFolded && ringFolded && pinkyFolded;
  };

  const checkAirSelection = (point) => {
    // For UI (Not mirrored), use 1 - point.x
    const x = 1 - point.x; 
    const y = point.y;
    
    if (y < 0.22) { 
      const startX = 0.406;
      const endX = 0.594;
      if (x > startX && x < endX) {
        const relativeX = (x - startX) / (endX - startX);
        const index = Math.floor(relativeX * colors.length);
        if (index >= 0 && index < colors.length) {
          const color = colors[index];
          
          setHoverTarget(color.hex);
          hoverTargetRef.current = color.hex;
          
          const nextProgress = hoverProgressRef.current + 12;
          if (nextProgress >= 100) {
            if (color.hex === 'CLEAR') {
              clearCanvas();
            } else {
              setSelectedColor(color.hex);
            }
            setHoverProgress(0);
            hoverProgressRef.current = 0;
          } else {
            setHoverProgress(nextProgress);
            hoverProgressRef.current = nextProgress;
          }
          return true;
        }
      }
    }
    setHoverTarget(null);
    hoverTargetRef.current = null;
    setHoverProgress(0);
    hoverProgressRef.current = 0;
    return false;
  };

  const drawOnCanvas = (point) => {
    if (!drawingCanvasRef.current) return;
    const ctx = drawingCanvasRef.current.getContext('2d');
    const { width, height } = drawingCanvasRef.current;
    
    // Low-pass filter (Exponential Moving Average) to eliminate coordinate jitter
    const alpha = 0.28; // 0.28 is the perfect sweet spot for butter-smooth lines with zero delay
    
    const currentX = point.x * width;
    const currentY = point.y * height;
    
    if (!smoothedPointRef.current) {
      smoothedPointRef.current = { x: currentX, y: currentY };
    } else {
      smoothedPointRef.current.x = smoothedPointRef.current.x * (1 - alpha) + currentX * alpha;
      smoothedPointRef.current.y = smoothedPointRef.current.y * (1 - alpha) + currentY * alpha;
    }
    
    const x = smoothedPointRef.current.x;
    const y = smoothedPointRef.current.y;
    
    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.strokeStyle = selectedColorRef.current === 'CLEAR' ? '#00f2ff' : selectedColorRef.current;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPointRef.current = { x, y };
  };

  const detect = async () => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const startTimeMs = performance.now();
      const ctx = canvasRef.current.getContext('2d');
      const { width, height } = canvasRef.current;
      
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      ctx.drawImage(drawingCanvasRef.current, 0, 0, width, height);
      
      if (handLandmarker) {
        const handResults = await handLandmarker.detectForVideo(videoRef.current, startTimeMs);
        if (handResults.landmarks && handResults.landmarks.length > 0) {
          // Draw Hand Skeleton & Joints for all detected hands
          handResults.landmarks.forEach((hand) => {
            // Draw skeleton lines
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(0, 242, 255, 0.55)';
            ctx.lineCap = 'round';
            HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
              const startPt = hand[startIdx];
              const endPt = hand[endIdx];
              if (startPt && endPt) {
                ctx.beginPath();
                ctx.moveTo(startPt.x * width, startPt.y * height);
                ctx.lineTo(endPt.x * width, endPt.y * height);
                ctx.stroke();
              }
            });

            // Draw joint dots
            ctx.fillStyle = '#ffffff';
            hand.forEach((joint) => {
              ctx.beginPath();
              ctx.arc(joint.x * width, joint.y * height, 4, 0, Math.PI * 2);
              ctx.fill();
            });
          });

          const hand = handResults.landmarks[0];
          const tip = hand[8];
          
          const inSelectionZone = checkAirSelection(tip);
          
          if (!inSelectionZone && isPointing(hand)) {
            drawOnCanvas(tip);
            // Visual cursor for drawing (direct x)
            ctx.fillStyle = selectedColorRef.current === 'CLEAR' ? '#fff' : selectedColorRef.current;
            ctx.beginPath();
            ctx.arc(tip.x * width, tip.y * height, 15, 0, Math.PI * 2);
            ctx.fill();
          } else {
            lastPointRef.current = null;
            smoothedPointRef.current = null;
            if (inSelectionZone) {
              // Selection cursor (mirrored view)
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.arc(tip.x * width, tip.y * height, 20, 0, Math.PI * 2 * (hoverProgressRef.current / 100));
              ctx.stroke();
            } else {
              // Hover cursor
              ctx.strokeStyle = 'rgba(255,255,255,0.4)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(tip.x * width, tip.y * height, 10, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        } else {
          lastPointRef.current = null;
          smoothedPointRef.current = null;
          setHoverTarget(null);
        }
      }
    }
    requestRef.current = requestAnimationFrame(detect);
  };

  useEffect(() => {
    if (isCameraReady && handLandmarker) {
      detect();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCameraReady, handLandmarker]);

  return (
    <div className="hand-tracker-container">
      {isLoading && <div className="loader-overlay"><div className="loader"></div></div>}
      {!isCameraReady && !isLoading && (
        <div className="start-overlay"><button className="btn-primary" onClick={startCamera}>Start Drawing</button></div>
      )}
      <div className="controls-panel airspace-panel">
        <div className="palette">
          {colors.map(color => (
            <div key={color.hex} className={`color-swatch air-target ${selectedColor === color.hex || hoverTarget === color.hex ? 'active' : ''}`}
              style={{ backgroundColor: color.hex === 'CLEAR' ? '#333' : color.hex }}>
              {color.hex === 'CLEAR' && <span>🗑️</span>}
              {hoverTarget === color.hex && <div className="hover-ring" style={{ height: `${hoverProgress}%` }}></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="video-wrapper">
        <video ref={videoRef} autoPlay playsInline muted style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
        <canvas ref={canvasRef} className="output-canvas" width={1280} height={720} />
        <canvas ref={drawingCanvasRef} className="hidden-canvas" width={1280} height={720} style={{ display: 'none' }} />
      </div>
      <div className="status-badge"><span className={`dot ${isCameraReady ? 'active' : ''}`}></span> {isCameraReady ? debugStatus : 'OFFLINE'}</div>
    </div>
  );
};

export default HandTracker;
