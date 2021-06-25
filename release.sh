#!/bin/bash
printf '\e[1;34m%-6s\e[m\n' "begin to release all site" 
echo 'begin release at' `date +"%Y-%m-%d::%T"` > ./release.log
# app.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release app.deri.finance start" 
./release_app.sh silence >> ./release.log 2>&1
printf '\e[1;34m%-6s\e[m\n' "release app.deri.finance success" 
# deri.finance
printf '\e[1;34m%-6s\e[m\n' "release deri.finance start" 
./release_index.sh silence >> ./release.log 2>&1
printf '\e[1;34m%-6s\e[m\n' "release deri.finance success"
# bridge.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release bridge.deri.finance start" 
./release_bridge.sh silence >> ./release.log 2>&1
printf '\e[1;34m%-6s\e[m\n' "release bridge.deri.finance success"
# governance.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release governance.deri.finance start" 
./release_governance.sh silence >> ./release.log 2>&1
printf '\e[1;34m%-6s\e[m\n' "release governance.deri.finance success"

printf '\e[1;34m%-6s\e[m\n' "all site release success " 

printf '\e[1;34m%-6s\e[m\n' "clear build dir"
rm -rf ./build 
echo 'end release at' `date +"%Y-%m-%d::%T"` >> ./release.log

