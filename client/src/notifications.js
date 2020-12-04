
export const setupWSConnection = (updateMessages)  => {
  
  // if not registered, do nothing
  if(sessionStorage.getItem('token') === null) {
      return;
  }

  // Create WebSocket connectionws://localhost:8085
  const socket = new WebSocket('ws://rendezvous-cis557-wsserver.herokuapp.com', sessionStorage.getItem('token'));

  // Connection opened
  socket.addEventListener('open', () => {
      console.log('ws connection opened');
      socket.send('Hello Server!');
  });

  // Listener for messages
  socket.addEventListener('message', (event) => {
      // parse message to json
      const pushMessage = JSON.parse(event.data);
    console.log('Message from server ', pushMessage);
    /*if(pushMessage.type === 'new user'){ 
      console.log('user ' + pushMessage.user);
    } */
    if(pushMessage.type === 'delivered'){
      //texts.current.push(`sent(${pushMessage.to}): ${pushMessage.text}`);
      // update previous message box via state and props
      updateMessages(pushMessage.data); // update messages to fire re-rendering
    }
    if(pushMessage.type === 'new message'){
      console.log('new message');
      //texts.current.push(`${pushMessage.from}: ${pushMessage.text}`);
      // update previous message box via state and props
      updateMessages(pushMessage.data);  // update messages to fire re-rendering
    }
  });

  // Connection closed
  socket.addEventListener('close', (_event) => {
    console.log('Connection closed bye bye! ');
  });
}
  

