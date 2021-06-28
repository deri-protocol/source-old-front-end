echo PUBLIC_URL=/ > .env.production
echo REACT_APP_WSS_URL=wss://oracle2.deri.finance >> .env.production
echo REACT_APP_REST_SERVER_URL=https://testnetapi.deri.finance >> .env.production
yarn build --nomaps 
