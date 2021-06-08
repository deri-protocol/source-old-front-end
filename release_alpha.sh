echo  PUBLIC_URL=/ > .env.production
yarn build --nomaps
cp -R build/* ../alphatest
cd ../alphatest
git checkout main
git pull origin main
git add .
git commit -m 'release'
git push origin main
