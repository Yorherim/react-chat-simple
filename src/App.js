import React from 'react';

import reducer from './reducer';
import JoinBlock from './components/JoinBlock';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    isAuth: false
  });

  const onLogin = () => {
    dispatch({
      type: 'IS_AUTH',
      payload: true
    })
  }

  console.log(state);

  return (
    <div className="wrapper">
      {!state.isAuth && <JoinBlock onLogin={onLogin} />}
    </div>
  );
}

export default App;
