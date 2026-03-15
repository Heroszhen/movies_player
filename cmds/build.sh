#! /bin/bash
# build react

date

mv .env.local dist.env.local
mv .env.dist.prod.local .env.local
rm -rf public/build var/cache

echo `pwd`
npm run build

mv .env.local .env.dist.prod.local
mv dist.env.local .env.local


date