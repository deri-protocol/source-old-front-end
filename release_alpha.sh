echo  PUBLIC_URL=/ > .env.production
echo REACT_APP_WSS_URL=wss://oracle4.deri.finance >> .env.production
echo REACT_APP_REST_SERVER_URL=https://alphaapi.deri.finance >> .env.production

yarn build --nomaps
cp -R build/* ../alphatest
cd ../alphatest
git checkout main
git pull origin main
git add .
git commit -m 'release'
git push origin main
