"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="text-right">
      <p className="text-2xl font-bold font-mono tracking-wider text-foreground">
        {format(time, 'HH:mm:ss')}
      </p>
      <p className="text-sm text-muted-foreground">
        {format(time, 'EEEE, d MMMM yyyy')}
      </p>
    </div>
  );
}
