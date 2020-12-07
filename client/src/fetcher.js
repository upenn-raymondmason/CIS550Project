const getUsers = async () => {
    const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    };
    const response = await fetch('https://golazo-server.herokuapp.com/users/', requestOptions);
    return response.json();
};

const createUser = async (username, email, password, date) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username: username, email: email, password: password, date: date })
    };
    const response = await fetch('https://golazo-server.herokuapp.com/user/', requestOptions);
    return response.json();
};

const loginUser = async (email, password) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({email: email, password: password })
    };
    const response = await fetch('https://golazo-server.herokuapp.com/login/', requestOptions);
    return response.json();
};

const getUser = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester}),
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_user/', requestOptions);
  return response.json();
};

const getName = async (email) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({email: email}),
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_name/', requestOptions);
  return response.json();
};

const addUser = async (requester, target) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, target: target })
  };
  const response = await fetch('https://golazo-server.herokuapp.com/add_user/', requestOptions);
  return response.json();
};

const remUser = async (requester, target) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, target: target })
  };
  const response = await fetch('https://golazo-server.herokuapp.com/rem_user/', requestOptions);
  return response.json();
};

const getPlayers = async (name, start, end, attr, min, max) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({name: name, start: start, end: end, attr: attr, min: min, max: max})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_players/', requestOptions);
  return response.json();
};

const getPlayerData = async (name) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({name: name})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_player_data/', requestOptions);
  return response.json();
};

export {getUsers, createUser, loginUser, getUser, getName, addUser, remUser, getPlayers, getPlayerData};