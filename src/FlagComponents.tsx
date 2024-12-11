import React from 'react';

export const FlagCanvas: React.FC = () => {
  return (
    <div className="flag">
      <div className="orange"></div>
      <div className="white">
        <div className="wheel"></div>
      </div>
      <div className="green"></div>
    </div>
  );
};

export const FlagComponents = [
  { id: 'orange', type: 'rect', color: 'orange' },
  { id: 'white', type: 'rect', color: 'white' },
  { id: 'green', type: 'rect', color: 'green' },
  { id: 'wheel', type: 'circle', color: 'blue' },
];
