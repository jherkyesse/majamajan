import { useState, useEffect } from 'react';

function useLogin({ db, majanKey, username, setMajanDataMap, setUsername, setMajanKey, setMajanCoordinateList, setLeftMajanList }) {
  const [isLogin, setIsLogin] = useState(false);
  const [reference, setReference] = useState();
  function retryLogin(majanKey, username) {
    if (!majanKey || !username) return;
    const reference = db.ref(majanKey);
    setReference(reference);
    reference.on('value', (snapshot) => {
      const data = snapshot.val();
      // console.log('data', data);
      const time = Date.now();
      if (!data) {
        db.ref(`${majanKey}/__userList__/${username}`).set({
          majanData: {
            host: '1',
            order: '0',
            messageList: {
              [time]: `Welcome ${username}!`
            },
          }
        });
        setUsername(username);
        setMajanKey(majanKey);
      } else {
        const { __majanCoordinateList__, __userList__ = {}, __leftMajanList__ } = data;
        const { majanData } = __userList__[username] || {};
        if (!majanData) {
          db.ref(`${majanKey}/__userList__/${username}`).set({
            majanData: {
              host: '0',
              order: Object.keys(__userList__).length,
              messageList: {
                [time]: `Welcome ${username}!`
              }
            }
          });
          setUsername(username);
          setMajanKey(majanKey);
        } else {
          setMajanDataMap(__userList__);
        }
        if (__majanCoordinateList__) setMajanCoordinateList(__majanCoordinateList__);
        if (__leftMajanList__) setLeftMajanList(__leftMajanList__);
      }
      setIsLogin(true);
    });
  }
  function logOut() {
    reference.off();
  }
  useEffect(() => {
    retryLogin(majanKey, username);
  }, []);
  return [isLogin, retryLogin, logOut];
}

export default useLogin;
