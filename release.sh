echo PUBLIC_URL=https://cdn.jsdelivr.net/gh/deri-finance/app@main > .env.production
yarn build --nomaps
cp -R build/* ../app
cd ../app
git checkout main
git pull origin main
cp index.html index.bak.html
cp asset-manifest.json asset-manifest.bak.json
cp manifest.json manifest.bak.json
git add .
git commit -m 'release'
git push origin main
