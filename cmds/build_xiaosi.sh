#! /bin/bash
# build react

date

mv .env.local dist.env.local
mv .env.dist.xiaosi.local .env.local
rm -rf public/build var/cache

echo `pwd`
npm run build

mv .env.local .env.dist.xiaosi.local
mv dist.env.local .env.local


date