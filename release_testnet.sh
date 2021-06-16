source ~/.bashrc
echo PUBLIC_URL=/ > .env.development
echo REACT_APP_WSS_URL=wss://oracle2.deri.finance >> .env.development
echo REACT_APP_REST_SERVER_URL=https://testnetapi.deri.finance >> .env.development
npm run build_testnet --nomaps --env=development
cp -R build/* ../testnet
cd ../testnet
git checkout main
cp index.html index.bak.html
cp asset-manifest.json asset-manifest.bak.json
cp manifest.json manifest.bak.json
git pull origin main
git add .
git commit -m 'release'
git push origin main
