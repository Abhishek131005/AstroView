import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

function CountdownTimer({ 
  targetDate, 
  onComplete,
  showLabels = true,
  compact = false,
  className = '',
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && onComplete) {
        onComplete();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (timeLeft.expired) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-5 h-5 text-solar-amber" />
        <span className="text-solar-amber font-semibold">Event Started</span>
      </div>
    );
  }

  const timeUnits = [
    { value: timeLeft.days, label: 'Days', short: 'd' },
    { value: timeLeft.hours, label: 'Hours', short: 'h' },
    { value: timeLeft.minutes, label: 'Minutes', short: 'm' },
    { value: timeLeft.seconds, label: 'Seconds', short: 's' },
  ];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 font-mono text-solar-amber ${className}`}>
        <Clock className="w-4 h-4" />
        {timeUnits.map((unit, index) => (
          <span key={unit.label}>
            {String(unit.value).padStart(2, '0')}
            {unit.short}
            {index < timeUnits.length - 1 && ' '}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="bg-bg-tertiary border border-white/10 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold font-mono text-solar-amber tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
          </div>
          {showLabels && (
            <span className="text-xs text-muted-gray mt-1 uppercase tracking-wide">
              {unit.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default CountdownTimer;
