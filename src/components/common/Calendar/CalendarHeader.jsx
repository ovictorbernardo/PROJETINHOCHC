// src/components/common/Calendar/CalendarHeader.jsx
import React from 'react';

const CalendarHeader = () => {
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return (
    <div className="grid grid-cols-7 gap-2 mb-4">
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-semibold text-gray-600 py-2">
          {day}
        </div>
      ))}
    </div>
  );
};

export default CalendarHeader;