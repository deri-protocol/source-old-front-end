#!/bin/bash
echo PUBLIC_URL=https://cdn.jsdelivr.net/gh/deri-finance/app@main > .env.production
yarn build --nomaps
repo=$HOME/work/app

if [ ! -d $repo ]; then
  printf '\e[1;34m%-6s\e[m\n' "bridge repo is not exit ,clone it from git@github.com:deri-finance/app.git" 
  git clone git@github.com:deri-finance/app.git $repo -b main
fi

printf '\e[1;34m%-6s\e[m\n' 'git checkout main branch and fetch '
git -C $repo checkout main
git -C $repo pull origin main 
printf '\e[1;34m%-6s\e[m\n' 'backup current version'
cp $repo/index.html $repo/index.bak.html
cp $repo/asset-manifest.json $repo/asset-manifest.bak.json
cp $repo/manifest.json $repo/manifest.bak.json
printf '\e[1;34m%-6s\e[m\n' 'copy to '$repo

cp -R build/* $repo
git -C $repo add .
git -C $repo commit -m 'release app'
read -r -p  "execute git push?[Y/n]" input
case $input in
    [yY][eE][sS]|[yY])
printf '\e[1;34m%-6s\e[m\n' "git push origin main"
git -C $repo push origin main
exit
 ;;
     [nN][oO]|[nN])
 echo "No"
 exit
        ;;
 *)
printf '\e[1;34m%-6s\e[m\n' "Invalid input..."
 exit
 ;;
 esac

