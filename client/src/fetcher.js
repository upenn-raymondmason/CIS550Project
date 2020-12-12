const getUsers = async () => {
    const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    };
    const response = await fetch('http://localhost:8080/users/', requestOptions);
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
    const response = await fetch('http://localhost:8080/user/', requestOptions);
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
    const response = await fetch('http://localhost:8080/login/', requestOptions);
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
  const response = await fetch('http://localhost:8080/get_user/', requestOptions);
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
  const response = await fetch('http://localhost:8080/get_name/', requestOptions);
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
  const response = await fetch('http://localhost:8080/add_user/', requestOptions);
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
  const response = await fetch('http://localhost:8080/rem_user/', requestOptions);
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
  const response = await fetch('http://localhost:8080/get_players/', requestOptions);
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
  const response = await fetch('http://localhost:8080/get_player_data/', requestOptions);
  return response.json();
};

const getTeams = async (name) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({name: name})
  };
  const response = await fetch('http://localhost:8080/get_teams/', requestOptions);
  return response.json();
};

const getTeamData = async (team_api_id) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({team_api_id: team_api_id})
  };
  const response = await fetch('http://localhost:8080/get_team_data/', requestOptions);
  return response.json();
};

const getPlayerDataId = async (player_id, date) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({player_id: player_id, date: date})
  };
  const response = await fetch('http://localhost:8080/get_player_data_id/', requestOptions);
  return response.json();
};

const getFormation = async (team_api_id, season) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({team_api_id: team_api_id, season: season})
  };
  const response = await fetch('http://localhost:8080/get_formation/', requestOptions);
  return response.json();
};

export {getUsers, createUser, loginUser, getUser, getName, addUser, remUser, getPlayers, getPlayerData, getTeams, getTeamData, getPlayerDataId, getFormation};