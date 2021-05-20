yarn build
cp -R build/* ../alphatest
cd ../alphatest
git add .
git commit -m 'release'
git push origin master
