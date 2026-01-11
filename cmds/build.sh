#! /bin/bash
# build react

date

mv .env.local dist.env.local
mv .env.dist.prod.local .env.prod.local
rm -rf public/build var/cache

echo `pwd`
npm run build

mv dist.env.local .env.local
mv .env.prod.local .env.dist.prod.local

date