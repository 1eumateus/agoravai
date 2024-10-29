#!/bin/bash

# install && build do frontend
cd frontend
mv .env .tmp
echo "VITE_URL=http://localhost:3008/api/v1" > .env
npm install
npm run build
mv .tmp .env
cd ..

# Criação da distribuição
rm -rf dist
mkdir dist
cp -r backend/* dist
cp -r backend/.* dist
mkdir dist/public/ui
cp -r frontend/dist/* dist/public/ui
cp -r frontend/public/* dist/public

sed -r "s/port=(.*)/port=3008/" backend/.env | sed -r "s/HOST_ROOT=(.*)/HOST_ROOT=http:\\/\\/localhost:3008/" > dist/.env

# Inicialização do servidor
cd dist
pm2 delete all
nodemon servidor.js