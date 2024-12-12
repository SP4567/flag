import React, { useState, useEffect } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Shake detection constants
const SHAKE_WINDOW_MS = 1500; // Time window to track shakes
const SHAKE_COUNT_THRESHOLD = 15; // Number of shakes required
const SHAKE_MAGNITUDE_THRESHOLD = 15; // Acceleration threshold for shakes
const DEBOUNCE_TIME_MS = 5000; // Cooldown period after shake
const LOW_PASS_FILTER_FACTOR = 0.8; // Smoothing factor for accelerometer readings

let motionEvents: { timestamp: number; x: number; y: number }[] = [];
let lastShakeTime = 0;
let smoothedX: number = 0, smoothedY: number = 0, smoothedZ: number = 0;

const initialComponents = [
  { id: 'orange', color: 'orange', height: 50 },
  { id: 'white', color: 'white', height: 50, hasWheel: true },
  { id: 'green', color: 'green', height: 50 },
  { id: 'wheel', color: 'blue', type: 'wheel' },
];

const App: React.FC = () => {
  const [shakeDetected, setShakeDetected] = useState(false);
  const [components, setComponents] = useState(initialComponents);
  const [droppedComponents, setDroppedComponents] = useState<any[]>([]);

  // Shake detection logic
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion, true);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion, true);
    };
  }, []);

  const handleMotion = (event: DeviceMotionEvent) => {
    const { acceleration } = event;

    if (!acceleration) return;

    const rawX = acceleration.x ?? 0; 
    const rawY = acceleration.y ?? 0; 
    const rawZ = acceleration.z ?? 0; 

    smoothedX = rawX * (1 - LOW_PASS_FILTER_FACTOR) + smoothedX * LOW_PASS_FILTER_FACTOR;
    smoothedY = rawY * (1 - LOW_PASS_FILTER_FACTOR) + smoothedY * LOW_PASS_FILTER_FACTOR;
    smoothedZ = rawZ * (1 - LOW_PASS_FILTER_FACTOR) + smoothedZ * LOW_PASS_FILTER_FACTOR;

    const magnitude = Math.sqrt(smoothedX ** 2 + smoothedY ** 2);

    if (magnitude < SHAKE_MAGNITUDE_THRESHOLD) return;

    const currentTime = Date.now();

    motionEvents.push({ timestamp: currentTime, x: smoothedX, y: smoothedY });

    motionEvents = motionEvents.filter(event => currentTime - event.timestamp < SHAKE_WINDOW_MS);

    if (motionEvents.length >= SHAKE_COUNT_THRESHOLD) {
      if (currentTime - lastShakeTime > DEBOUNCE_TIME_MS) {
        setShakeDetected(true);
        lastShakeTime = currentTime;
      }
      motionEvents = [];
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = [...components];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setComponents(newOrder);
    setDroppedComponents(prev => [...prev, removed]);
  };

  return (
    <div className="App">
      <h1>Indian Flag Game</h1>

      {shakeDetected ? (
        <>
          <h2>Recreate the Flag</h2>
          <div className="drop-area">
            <Droppable droppableId="flagCanvas">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flag-container"
                >
                  {droppedComponents.map((component) => (
                    <div
                      key={component.id}
                      style={{
                        backgroundColor: component.color,
                        height: component.height,
                        textAlign: 'center'
                      }}
                      className="dropped-item"
                    >
                      {component.hasWheel ? <div className="wheel"></div> : ''}
                    </div>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="components">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="components-container"
                  >
                    {components.map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flag-part"
                            style={{ backgroundColor: component.color, height: component.height }}
                          >
                            {component.hasWheel ? <div className="wheel"></div> : ''}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </>
      ) : (
        <div className="flag">
          <div className="orange"></div>
          <div className="white">
            <div className="wheel"></div>
          </div>
          <div className="green"></div>
        </div>
      )}
    </div>
  );
};

export default App;
