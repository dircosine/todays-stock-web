import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';

interface TimerProps {
  initialSec: number;
  onTimeOver: () => void;
}

function Timer({ initialSec, onTimeOver }: TimerProps) {
  const [timeSec, setTimeSec] = useState(initialSec);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSec((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          clearInterval(timer);
          onTimeOver();
          return 0;
        }
      });
    }, 1000);
  }, []);

  return (
    <p>
      <Space>
        <ClockCircleOutlined />
        {`${Math.floor(timeSec / 60)}:${('0' + (timeSec % 60)).slice(-2)}`}
      </Space>
    </p>
  );
}

export default Timer;
