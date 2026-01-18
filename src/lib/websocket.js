import Config from '../constants/config';

let socket;
let messageCallback = null;

export function connectWebSocket(orgSlug, onMessageCallback) {
  socket = new WebSocket(Config.WEBSOCKET_URL + `?org=${orgSlug}`);

  messageCallback = onMessageCallback;

  socket.onopen = () => {
    // WebSocket connected
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (messageCallback) {
      messageCallback(data);
    }
  };

  socket.onclose = () => {
    // WebSocket disconnected
  };

  socket.onerror = (err) => {
    // WebSocket error handled silently
  };
}

export function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}
