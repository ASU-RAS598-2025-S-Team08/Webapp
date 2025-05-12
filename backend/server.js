const WebSocket = require('ws');
const ROSLIB = require('roslib');

// Setup WebSocket server for frontend clients
const wsServer = new WebSocket.Server({ port: 8001 });
const frontendClients = new Set();

wsServer.on('connection', (ws) => {
  console.log('Frontend client connected');
  frontendClients.add(ws);

  const imuCallback = (message) => {
    const imuData = {
      linear_x: message.linear_acceleration.x,
      linear_y: message.linear_acceleration.y,
      linear_z: message.linear_acceleration.z,
      angular_x: message.angular_velocity.x,
      angular_y: message.angular_velocity.y,
      angular_z: message.angular_velocity.z
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'imu', data: imuData }));
    }
  };

  imuListener.subscribe(imuCallback);

  ws.on('close', () => {
    console.log('Frontend client disconnected');
    frontendClients.delete(ws);
  });
});

// Setup ROS connection
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

ros.on('connection', () => {
  console.log('Connected to rosbridge server.');
});

ros.on('error', (error) => {
  console.error('Error connecting to rosbridge server: ', error);
});

ros.on('close', () => {
  console.log('Connection to rosbridge server closed.');
});

// Setup IMU subscriber
const imuListener = new ROSLIB.Topic({
  ros: ros,
  name: '/rpi_12/imu',
  messageType: 'sensor_msgs/msg/Imu'
});

// Setup Camera Image Subscriber (Compressed)
const imageListener = new ROSLIB.Topic({
  ros: ros,
  name: '/rpi_12/oakd/rgb/preview/image_raw/compressed',
  messageType: 'sensor_msgs/msg/CompressedImage'
});

imageListener.subscribe((message) => {
  const base64Image = message.data; // Already base64-encoded JPEG

  // Send the base64 image data to all connected frontend clients
  frontendClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'image', data: base64Image }));
    }
  });
});
