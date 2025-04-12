import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-secondary-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
