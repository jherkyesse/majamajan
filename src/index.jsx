import { useState } from 'react';
import { render } from 'react-dom';
import { useLocalStorage } from 'react-use';
import Firebase from 'firebase/app';
import 'firebase/database';
import useLogin from './hooks/useLogin';
import Login from './containers/Login';
import Table from './containers/Table';
import firebaseConfig from './constants/firebase.config';
import './style/theme.scss';
import './style/main.scss';

Firebase.initializeApp(firebaseConfig);
const db = Firebase.database();

function App() {
  const [majanKey, setMajanKey] = useLocalStorage('majanKey');
  const [username, setUsername] = useLocalStorage('username');
  const [majanDataMap, setMajanDataMap] = useState();
  const [majanCoordinateList, setMajanCoordinateList] = useState([]);
  const [leftMajanList, setLeftMajanList] = useState([]);
  const [isLogin, retryLogin] = useLogin({
    db,
    majanKey,
    username,
    setMajanDataMap,
    setUsername,
    setMajanKey,
    setMajanCoordinateList,
    setLeftMajanList,
  });

  return (
    <>
      {isLogin ? (
        <Table
          db={db}
          username={username}
          majanKey={majanKey}
          majanDataMap={majanDataMap}
          majanCoordinateList={majanCoordinateList}
          leftMajanList={leftMajanList}
        />
      ) : (
        <Login setMajanKey={setMajanKey} login={retryLogin} />
      )}
    </>
  );
}

render(<App />, document.getElementById('root'));
