PUBLIC_URL=https://lhd-defactory.github.io/lhd-dfactory/
echo $PUBLIC_URL
yarn build
cp -R build/* ../lhd-dfactory
cd ../lhd-defactory
git add .
git commit -m 'release'
git push origin master
