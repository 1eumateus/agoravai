#!/bin/bash

user_is=`whoami`
if [ "$user_is" != "root" ]; then
    echo "Usuário: $user_is"
    echo "Executa como root (sudo)"
    exit 1
fi

cat ./backend/.env

#.env
echo "Entre o HOST:"
read host
echo "Entre a porta do servidor:"
read port
echo "Entre o JWT secret key:"
read jwt
echo "Entre a URL do banco de dados:"
read database
echo "Entre o email:"
read email
echo "Entre a senha do email:"
read senha
echo "Entre a senha do admin do banco de dados:"
read senha_base
echo "Inicializar o servidor na ignição da máquina? (N/y)"
read st

apt install -y npm nodejs

# Mongo DB
dep_installed=`apt list --installed  2>&- | grep "^mongodb-org\/" | wc -l`
if [ "$dep_installed" = "0" ]; then
#    apt-get install gnupg curl
#    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
#    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
#    sudo apt-get update
#    sudo apt-get install -y mongodb-org
    apt-get install -y gnupg curl
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update
    wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
    dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
    apt-get install -y mongodb-org

    systemctl enable mongod.service
    systemctl start mongod
    rm libssl1.1_1.1.1f-1ubuntu2_amd64.deb
fi

# install do backend
cd backend
npm install
npm install axios
cd ..

# install && build do frontend
cd frontend
mv .env .tmp
echo "VITE_URL=$host:$port/api/v1" > .env
npm install
npm run build
mv .tmp .env
cd ..

# Criação da distribuição
rm -rf dist
mkdir dist
cp -r backend/* dist
cp -r backend/.* dist
echo "port=$port" > dist/.env
echo "JWT_SECRET=$jwt" >>  dist/.env
echo "DATABASE_URL=$database" >> dist/.env
echo "SMTP_EMAIL='$email'" >> dist/.env
echo "SMTP_SENHA='$senha'" >> dist/.env
echo "ADMIN_EMAIL='$email'" >> dist/.env
echo "ADMIN_SENHA='$senha_base'" >> dist/.env
mkdir dist/public/ui
cp -r frontend/dist/* dist/public/ui
cp -r frontend/public/* dist/public

# pm2
if [ "$st" = "y" ]; then
    npm install pm2@latest -g
    cd dist
    pm2 delete all
    pm2 start servidor.js -i max
    pm2 startup
    pm2 save
fi


