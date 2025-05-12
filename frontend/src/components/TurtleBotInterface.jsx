import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TurtleBotInterface() {
  const [imuData, setImuData] = useState({
    linear_x: 0,
    linear_y: 0,
    linear_z: 0,
    angular_x: 0,
    angular_y: 0,
    angular_z: 0,
  });

  const [imageData, setImageData] = useState(null);
  const [imuHistory, setImuHistory] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8001');

    socket.onopen = () => {
      console.log('Connected to backend WebSocket');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'imu') {
          const timestamp = Date.now();
          const newEntry = { ...message.data, timestamp };
          setImuData(message.data);
          setImuHistory((prev) => {
            const updated = [...prev, newEntry];
            const tenSecondsAgo = timestamp - 10000;
            return updated.filter((entry) => entry.timestamp >= tenSecondsAgo);
          });
        } else if (message.type === 'image') {
          setImageData(`data:image/jpeg;base64,${message.data}`);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const chartData = {
    datasets: [
      {
        label: 'Linear X',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.linear_x })),
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
      {
        label: 'Linear Y',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.linear_y })),
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
      },
      {
        label: 'Linear Z',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.linear_z })),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Angular X',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.angular_x })),
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
      {
        label: 'Angular Y',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.angular_y })),
        borderColor: 'rgba(255, 159, 64, 1)',
        fill: false,
      },
      {
        label: 'Angular Z',
        data: imuHistory.map((d) => ({ x: d.timestamp, y: d.angular_z })),
        borderColor: 'rgba(255, 206, 86, 1)',
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'IMU Data (Last 10 Seconds)',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
          tooltipFormat: 'HH:mm:ss',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12">Turtlebot Factory Interface</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="bg-white border border-gray-300 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4">IMU Data Plot</h2>
          <div className="w-full h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </Card>

        <Card className="bg-white border border-gray-300 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4">Camera</h2>
          <div className="w-full h-64 bg-black rounded-xl overflow-hidden flex items-center justify-center">
            {imageData ? (
              <img
                src={imageData}
                alt="Live Camera"
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-white text-sm">Waiting for image...</span>
            )}
          </div>
        </Card>
      </div>

      <Card className="bg-white border border-gray-300 rounded-2xl shadow-lg p-6 mb-12 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Current IMU Data</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>Linear X: {imuData.linear_x.toFixed(3)}</div>
          <div>Angular X: {imuData.angular_x.toFixed(3)}</div>
          <div>Linear Y: {imuData.linear_y.toFixed(3)}</div>
          <div>Angular Y: {imuData.angular_y.toFixed(3)}</div>
          <div>Linear Z: {imuData.linear_z.toFixed(3)}</div>
          <div>Angular Z: {imuData.angular_z.toFixed(3)}</div>
        </div>
      </Card>
    </div>
  );
}
