#!/bin/bash
printf '\e[1;34m%-6s\e[m\n' "begin to release all site" 
# app.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release app.deri.finance start" 
./release_app.sh silence >/dev/null 2>&1
printf '\e[1;34m%-6s\e[m\n' "release app.deri.finance success" 
# deri.finance
printf '\e[1;34m%-6s\e[m\n' "release deri.finance start" 
./release_index.sh silence >/dev/null 2>&1
printf '\e[1;34m%-6s\e[m\n' "release deri.finance success"
# bridge.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release bridge.deri.finance start" 
./release_bridge.sh silence >/dev/null 2>&1
printf '\e[1;34m%-6s\e[m\n' "release bridge.deri.finance success"
# governance.deri.finance
printf '\e[1;34m%-6s\e[m\n' "release governance.deri.finance start" 
./release_governance.sh silence >/dev/null 2>&1
printf '\e[1;34m%-6s\e[m\n' "release governance.deri.finance success"

printf '\e[1;34m%-6s\e[m\n' "all site release success " 

printf '\e[1;34m%-6s\e[m\n' "clear build dir"
rm -rf ./build 

