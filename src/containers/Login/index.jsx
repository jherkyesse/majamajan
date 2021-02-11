import { useState } from 'react';

function Login({ majanKey, login }) {
  const [password, setPassword] = useState(majanKey);
  const [username, setUsername] = useState('');
  function onChangePassword({ target: { value } }) {
    setPassword(value);
  }
  function onChangeUsername({ target: { value } }) {
    setUsername(value);
	}
	function onClick() {
		login(password, username);
	}
	const disabled = !password || !username;
  return (
    <div className="login">
      <input value={password} onChange={onChangePassword} placeholder="Please enter invite code..." />
      <input value={username} onChange={onChangeUsername} placeholder="Please enter your username..." />
      <button disabled={disabled} type="button" onClick={onClick}>
        Login
      </button>
    </div>
  );
}

export default Login;
