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

const addTeam = async (requester, team) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, team: team })
  };
  const response = await fetch('https://golazo-server.herokuapp.com/add_team/', requestOptions);
  return response.json();
};

const remTeam = async (requester, team) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, team: team})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/rem_team/', requestOptions);
  return response.json();
};

const addPlayer = async (requester, player) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, player: player})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/add_player/', requestOptions);
  return response.json();
};

const remPlayer = async (requester, player) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, player: player})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/rem_player/', requestOptions);
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

const getTeams = async (name) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({name: name})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_teams/', requestOptions);
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
  const response = await fetch('https://golazo-server.herokuapp.com/get_team_data/', requestOptions);
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
  const response = await fetch('https://golazo-server.herokuapp.com/get_player_data_id/', requestOptions);
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
  const response = await fetch('https://golazo-server.herokuapp.com/get_formation/', requestOptions);
  return response.json();
};


const getFavPlayers = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_fav_players/', requestOptions);
  return response.json();
};


const getFavTeams = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('https://golazo-server.herokuapp.com/get_fav_teams/', requestOptions);
  return response.json();
};


export {getUsers, createUser, loginUser, getUser, getName, addTeam, remTeam, addPlayer, remPlayer, getPlayers, getPlayerData, getTeams, getTeamData, getPlayerDataId, getFormation, getFavPlayers, getFavTeams};