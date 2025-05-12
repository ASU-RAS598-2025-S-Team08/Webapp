// src/components/ui/card.jsx
import React from 'react';

export const Card = ({ children }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="p-4">
      {children}
    </div>
  );
};
