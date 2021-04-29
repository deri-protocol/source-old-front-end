yarn build
cp -R build/* ../lhd-defactory
cd ../lhd-defactory
git add .
git commit -m 'release'
git push origin master