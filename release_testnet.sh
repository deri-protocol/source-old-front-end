source ~/.bashrc
echo PUBLIC_URL=https://cdn.jsdelivr.net/gh/deri-finance/testnet@main > .env.production
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
