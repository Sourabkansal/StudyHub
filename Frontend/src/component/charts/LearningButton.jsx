import React, { useState, useEffect } from 'react';
import { FiPause, FiPlay } from 'react-icons/fi';

const LearningTimerButton = ({ bgColor, heading, data1, currentLabel }) => {
  const [isLearning, setIsLearning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timerInterval;
    let apiInterval;

    if (isLearning) {
      timerInterval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      apiInterval = setInterval(() => {
        sendLearningTime();
      }, 10 * 1000);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(apiInterval);
    };
  }, [isLearning]);

  const sendLearningTime = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/Charts/Get&Send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userid: data1,
            weekLabel: currentLabel,
            Readinghrs: 0,
            Learninghrs: 0.002777,
          }),
          credentials: 'include',
        }
      );
      const data = await response.json();
      console.log(data);
      localStorage.setItem('ChartData', JSON.stringify(data.updatedDay));
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleClick = () => {
    setIsLearning((prev) => !prev);
  };
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-5 py-2 shadow-md transition-transform transform hover:-translate-y-0.5"
      style={{ backgroundColor: bgColor }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
      }}
    >
      <span className="relative w-5 h-5">
        <FiPause
          size={20}
          className={`absolute transition-opacity duration-300 ${
            !isLearning ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <FiPlay
          size={20}
          className={`absolute transition-opacity duration-300 ${
            isLearning ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </span>
      <span className="inline-block min-w-[60px] text-left">
        {!isLearning ? `${heading}?` : formatTime(seconds)}
      </span>
    </button>
  );
};

export default LearningTimerButton;
