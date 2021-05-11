yarn build
cp -R build/* ../lhd-dfactory
cd ../lhd-dfactory
git add .
git commit -m 'release'
git push origin master
