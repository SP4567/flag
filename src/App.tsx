import React, { useState, useEffect } from 'react';
import './App.css';
import { FlagCanvas, FlagComponents } from './FlagComponents';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const App: React.FC = () => {
  const [shakeDetected, setShakeDetected] = useState(false);

  useEffect(() => {
    const handleShake = () => {
      setShakeDetected(true);
    };

    window.addEventListener('shake', handleShake);
    return () => window.removeEventListener('shake', handleShake);
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = [...components];
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    setComponents(newOrder);
  };

  const initialComponents = [
    { id: 'orange', color: 'orange', height: 50 },
    { id: 'white', color: 'white', height: 50 },
    { id: 'green', color: 'green', height: 50 },
    { id: 'wheel', color: 'blue', type: 'wheel' },
  ];

  const [components, setComponents] = useState(initialComponents);

  return (
    <div className="App">
      <h1>Indian Flag Game</h1>
      {!shakeDetected ? (
        <FlagCanvas />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="flagCanvas">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flag-container"
              >
                <h2>Recreate the Flag</h2>
                {components.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flag-part"
                        style={{
                          backgroundColor: component.color,
                          height: component.height,
                        }}
                      >
                        {component.type === 'wheel' ? 'Wheel' : ''}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default App;
