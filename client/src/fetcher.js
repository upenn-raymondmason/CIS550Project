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

const getContacts = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('http://localhost:8080/get_contacts/', requestOptions);
  return response.json();
};

const getSuggs = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('http://localhost:8080/get_suggs/', requestOptions);
  return response.json();
};

const changePassword = async (requester, newPassword) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester, newPassword: newPassword})
  };
  const response = await fetch('http://localhost:8080/change_password/', requestOptions);
  return response.json();
};

const deactivateAcc = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('http://localhost:8080/deactivate_acc/', requestOptions);
  return response.json();
};

// MESSAGING

const sendMessage = async (sender, receiver, text, time) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({sender: sender, receiver: receiver, text: text, time: time})
  };
  const response = await fetch('http://localhost:8080/send_msg/', requestOptions);
  return response.json();
};

const getMessages = async (requester) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({requester: requester})
  };
  const response = await fetch('http://localhost:8080/get_messages/', requestOptions);
  return response.json();
}

export {getUsers, createUser, loginUser, getUser, getName, addUser, remUser, getContacts, getSuggs, changePassword, deactivateAcc, sendMessage, getMessages};