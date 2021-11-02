#!/bin/bash
while IFS= read -r line; do
    echo "remove branch $line"
    git push -d origin $line
    git branch -d $line
done < "$1"