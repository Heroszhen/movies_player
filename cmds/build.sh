#! /bin/bash
# build react

date

mv .env.local dist.env.local
sleep 1
mv .env.dist.prod.local .env.local
rm -rf public/build var/cache

echo `pwd`
npm run build

mv .env.local .env.dist.prod.local
sleep 1
mv dist.env.local .env.local


date