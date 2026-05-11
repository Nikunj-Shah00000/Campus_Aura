let io = null;
const clients = new Map();

const setupWebSocket = (socketIO) => {
  io = socketIO;
  
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Store client with anonymous session
    clients.set(socket.id, {
      id: socket.id,
      connectedAt: new Date(),
      subscriptions: new Set()
    });
    
    // Handle subscription to real-time updates
    socket.on('subscribe', (channel) => {
      socket.join(channel);
      const client = clients.get(socket.id);
      if (client) client.subscriptions.add(channel);
      socket.emit('subscribed', { channel });
    });
    
    socket.on('unsubscribe', (channel) => {
      socket.leave(channel);
      const client = clients.get(socket.id);
      if (client) client.subscriptions.delete(channel);
    });
    
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      clients.delete(socket.id);
    });
  });
};

const publishToWebSocket = (channel, data) => {
  if (!io) return;
  
  // Anonymize data before broadcasting
  const anonymizedData = {
    ...data,
    timestamp: new Date(),
    // Ensure no PII is broadcast
    _id: undefined,
    anonymousId: undefined
  };
  
  io.to(channel).emit('update', anonymizedData);
  
  // Also broadcast to general channel
  io.emit('global-update', {
    channel,
    data: anonymizedData,
    type: 'real-time-analytics'
  });
};

const getActiveConnections = () => {
  return clients.size;
};

module.exports = { setupWebSocket, publishToWebSocket, getActiveConnections };