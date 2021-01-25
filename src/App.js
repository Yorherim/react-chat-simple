import React from 'react';
import socket from './socket';

import reducer from './reducer';
import JoinBlock from './components/JoinBlock';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null
  });

  const onLogin = (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj
    });

    // отправляем socket-запрос на backend
    socket.emit("ROOM: JOIN", obj);
  }

  return (
    <div className="wrapper">
      {!state.joined && <JoinBlock onLogin={onLogin} />}
    </div>
  );
}

export default App;
