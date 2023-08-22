import React, { useState, useRef } from 'react';
import './WebSocketEchoClient.css'; // Import the CSS file

const WebSocketEchoClient = () => {
    const [webSocketState, setWebSocketState] = useState('DISCONNECTED');
    let [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const inputRef = useRef(null);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    let websocket = useRef(null);
  
    const debug = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    const sendMessage = () => {
      const msg = inputRef.current.value;
      if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
        inputRef.current.value = '';
        websocket.current.send(msg);
        console.log('Message sent:', '"' + msg + '"');
        setMessages((prevMessages) => [...prevMessages, 'SENT: ' + msg]); // Add sent message to messages
      }
    };
  
    const handleInputChange = (event) => {
      setInputText(event.target.value);
    };

  const initWebSocket = () => {
    try {
      if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
        websocket.current.close();
      }
      const wsUri = inputRef.current.value;
      websocket.current = new WebSocket(wsUri);

      websocket.current.onopen = (evt) => {
        setWebSocketState('CONNECTED');
        debug('CONNECTED');
      };

      websocket.current.onclose = (evt) => {
        setWebSocketState('DISCONNECTED');
        debug('DISCONNECTED');
      };

      websocket.current.onmessage = (evt) => {
        console.log('Message received:', evt.data);
        debug(evt.data);
      };

      websocket.current.onerror = (evt) => {
        debug('ERROR: ' + evt.data);
      };
    } catch (exception) {
      debug('ERROR: ' + exception);
    }
  };

  const stopWebSocket = () => {
    if (websocket.current) {
      websocket.current.close();
    }
  };

  const checkSocket = () => {
    if (websocket.current != null) {
      let stateStr;
      switch (websocket.current.readyState) {
        case 0: {
          stateStr = 'CONNECTING';
          break;
        }
        case 1: {
          stateStr = 'OPEN';
          break;
        }
        case 2: {
          stateStr = 'CLOSING';
          break;
        }
        case 3: {
          stateStr = 'CLOSED';
          break;
        }
        default: {
          stateStr = 'UNKNOWN';
          break;
        }
      }
      debug('WebSocket state = ' + websocket.current.readyState + ' (' + stateStr + ')');
    } else {
      debug('WebSocket is null');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };
  const handleButtonClick = () => {
    setIsButtonClicked(true);
    setTimeout(() => {
      setIsButtonClicked(false);
    }, 100);
  };
  return (
    <div className="websocket">
      <h1 className="headerWebsocket">WebSocket Client</h1>
      <div className="text-input">
        <input type="text" ref={inputRef} placeholder="ws://localhost:1234" />
      </div>
      <div className="websocket-input">
        <button className={`button-85 ${isButtonClicked ? 'clicked' : ''}`} onClick={initWebSocket}>
          Connect
        </button>
        <button className={`button-85 ${isButtonClicked ? 'clicked' : ''}`} onClick={stopWebSocket}>
          Disconnect
        </button>
        <button className={`button-85 ${isButtonClicked ? 'clicked' : ''}`} onClick={checkSocket}>
          State
        </button>
      </div>
      <div className="messagesWrapper">
        <textarea value={messages.join('\n')} style={{ width: '400px', height: '200px' }} readOnly />
        <button className="clearButton" onClick={clearMessages}>
          X
        </button>
      </div>
      <div className="sendWrapper">
        <input type="text" value={inputText} onChange={handleInputChange} onKeyDown={(event) => event.keyCode === 13 && sendMessage()} />
        <button className={`button-85 ${isButtonClicked ? 'clicked' : ''}`} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default WebSocketEchoClient;
