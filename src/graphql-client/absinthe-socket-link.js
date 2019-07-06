import * as AbsintheSocket from '@absinthe/socket';
import {createAbsintheSocketLink} from '@absinthe/socket-apollo-link';
import {Socket as PhoenixSocket} from 'phoenix';
import {ACCESS_TOKEN_PARAM} from './index';

export const WEBSOCKET_SERVER_URI = 'ws://localhost:4000/socket';

export const phoenixSocket = new PhoenixSocket(
    WEBSOCKET_SERVER_URI,
    {
      params: () => {
        return {token: window.localStorage.getItem(ACCESS_TOKEN_PARAM)};
      },
    }
);

phoenixSocket.onOpen(() => {
  console.log('The Phoenix socket was opened')
  ;
});

phoenixSocket.onClose(() => {
  console.log('The Phoenix socket was closed')
  ;
});

phoenixSocket.onError(() => {
  console.log('Phoenix socket: An error ocurred')
  ;
});

export default createAbsintheSocketLink(AbsintheSocket.create(phoenixSocket));
