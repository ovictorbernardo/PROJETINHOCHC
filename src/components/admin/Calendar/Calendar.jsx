// src/components/common/Calendar/Calendar.jsx
import React from 'react';
import CalendarHeader from './CalendarHeader';
import DayCard from './DayCard';

const Calendar = ({ 
  mesAno, 
  dias, 
  onDaySelect, 
  selectedDay, 
  isAdmin = false 
}) => {
  const handleDayClick = (dayInfo) => {
    if (onDaySelect) {
      onDaySelect(dayInfo);
    }
  };

  return (
    <div className="calendar">
      <CalendarHeader />
      
      {/* 🆕 MELHORADO: Grid responsivo */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {dias.map(dayInfo => (
          <DayCard
            key={dayInfo.dia}
            dayInfo={dayInfo}
            isSelected={selectedDay === dayInfo.dia}
            isAdmin={isAdmin}
            onDayClick={handleDayClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;