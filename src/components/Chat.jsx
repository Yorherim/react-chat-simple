import React from 'react';
import socket from '../socket';

function Chat() {
  const [messageValue, setMessageValue] = React.useState('');

  return (
    <div className="chat">
      <div className="chat-users">
        <b>Users (1):</b>
        <ul>
          <li>test user</li>
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages">
          <div className="message">
            <p>hello</p>
            <div>
              <span>test user</span>
            </div>
          </div>
          <div className="message">
            <p>wazzup?</p>
            <div>
              <span>test user</span>
            </div>
          </div>
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"></textarea>
          <button type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
