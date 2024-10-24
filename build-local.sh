#!/bin/bash


# install && build do frontend
cd frontend
npm install
npm run build
cd ..

# Criação da distribuição
rm -rf dist
mkdir dist
cp -r backend/* dist
cp -r backend/.* dist
mkdir dist/public/ui
cp -r frontend/dist/* dist/public/ui
cp -r frontend/public/* dist/public

sed -r "s/port=(.*)/port=3008/" backend/.env > dist/.env

# Inicialização do servidor
cd dist
pm2 delete all
pm2 start servidor.js
cd ..
pm2 monit