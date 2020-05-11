import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Space } from 'antd';

interface TimerProps {
  className?: string;
  initialSec: number;
  onTimeOver: () => void;
}

function Timer({ className, initialSec, onTimeOver }: TimerProps) {
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

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`Timer ${className}`} style={{ marginBottom: 14 }}>
      <Space>
        <ClockCircleOutlined />
        {`${Math.floor(timeSec / 60)}:${('0' + (timeSec % 60)).slice(-2)}`}
      </Space>
    </div>
  );
}

Timer.defaultProps = {
  className: '',
};

export default Timer;
