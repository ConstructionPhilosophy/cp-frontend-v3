import React, { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CustomDatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

type ViewMode = 'year' | 'month' | 'date';

export function CustomDatePicker({
  selected,
  onSelect,
  placeholder = "Pick a date",
  className,
  disabled,
  error
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [currentYear, setCurrentYear] = useState(selected?.getFullYear() || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selected?.getMonth() || new Date().getMonth());

  const currentDate = new Date();
  const maxYear = currentDate.getFullYear() - 13; // At least 13 years old
  const minYear = 1940;

  // Generate year ranges (12 years per view)
  const getYearRange = () => {
    const startYear = Math.floor((currentYear - minYear) / 12) * 12 + minYear;
    const years = [];
    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      if (year <= maxYear) {
        years.push(year);
      }
    }
    return { years, startYear, endYear: Math.min(startYear + 11, maxYear) };
  };

  const { years, startYear, endYear } = getYearRange();

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekDay = firstDay.getDay();

    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startWeekDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }

    // Next month's days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode('month');
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setViewMode('date');
  };

  const handleDateSelect = (date: Date) => {
    onSelect(date);
    setIsOpen(false);
    setViewMode('year'); // Reset for next time
  };

  const navigateYears = (direction: 'prev' | 'next') => {
    const newYear = direction === 'prev' 
      ? Math.max(minYear, startYear - 12)
      : Math.min(maxYear - 11, startYear + 12);
    setCurrentYear(newYear);
  };

  const renderYearView = () => (
    <div className="p-3 w-80">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateYears('prev')}
          disabled={startYear <= minYear}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium text-sm">
          {startYear} - {endYear}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateYears('next')}
          disabled={endYear >= maxYear}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {years.map((year) => (
          <Button
            key={year}
            variant={year === currentYear ? "default" : "outline"}
            size="sm"
            onClick={() => handleYearSelect(year)}
            className="h-8 text-sm"
          >
            {year}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-between mt-4 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={() => {
          const today = new Date();
          setCurrentYear(today.getFullYear());
          setCurrentMonth(today.getMonth());
          handleDateSelect(today);
        }}>
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={() => {
          onSelect(undefined);
          setIsOpen(false);
        }}>
          Clear
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="p-3 w-80">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode('year')}
          className="h-7 px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Button>
        <div className="font-medium text-sm bg-blue-100 px-3 py-1 rounded">
          {currentYear}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode('year')}
          className="h-7 w-7 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant={index === currentMonth ? "default" : "outline"}
            size="sm"
            onClick={() => handleMonthSelect(index)}
            className="h-8 text-sm"
          >
            {month}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-between mt-4 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={() => {
          const today = new Date();
          setCurrentYear(today.getFullYear());
          setCurrentMonth(today.getMonth());
          handleDateSelect(today);
        }}>
          Today
        </Button>
        <Button variant="ghost" size="sm" onClick={() => {
          onSelect(undefined);
          setIsOpen(false);
        }}>
          Clear
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );

  const renderDateView = () => {
    const days = getDaysInMonth(currentYear, currentMonth);
    
    return (
      <div className="p-3 w-80">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('month')}
            className="h-7 px-3"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
          </Button>
          <div className="font-medium text-sm bg-blue-100 px-3 py-1 rounded">
            {months[currentMonth]} {currentYear}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('month')}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayObj, index) => {
            const isSelected = selected && 
              dayObj.date.getDate() === selected.getDate() &&
              dayObj.date.getMonth() === selected.getMonth() &&
              dayObj.date.getFullYear() === selected.getFullYear();
            
            const isToday = dayObj.date.toDateString() === currentDate.toDateString();
            const isDisabled = dayObj.date > currentDate || dayObj.date < new Date(minYear, 0, 1);

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                onClick={() => !isDisabled && handleDateSelect(dayObj.date)}
                disabled={isDisabled}
                className={cn(
                  "h-8 w-8 p-0 text-sm",
                  !dayObj.isCurrentMonth && "text-gray-400",
                  isToday && !isSelected && "bg-blue-100",
                  isSelected && "bg-blue-600 text-white",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {dayObj.day}
              </Button>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-4 pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={() => {
            const today = new Date();
            if (today <= new Date(maxYear, 11, 31)) {
              handleDateSelect(today);
            }
          }}>
            Today
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            onSelect(undefined);
            setIsOpen(false);
          }}>
            Clear
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            error && "border-red-500",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {viewMode === 'year' && renderYearView()}
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'date' && renderDateView()}
      </PopoverContent>
    </Popover>
  );
}