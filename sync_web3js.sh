#!/bin/bash
# mkdir -p ~/work/website2/deri.js 
cd ~/work/website2/deri.js

read -r -p  "Please input the branch of sync for deri.js [master]" branch
if [[ $branch = "" ]]; then 
    echo 'Your current branch is Master'
    branch=master
else
    echo "Your current branch is '$branch'"
fi
git checkout $branch
git pull origin $branch
cp -R  ~/work/website2/deri.js/frontend/src/*  ~/work/app.deri.finance/src/lib/web3js/