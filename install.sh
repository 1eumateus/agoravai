#!/bin/bash

user_is=`whoami`
if [ "$user_is" != "root" ]; then
    echo "Usuário: $user_is"
    echo "Executa como root (sudo)"
    exit 1
fi

#.env
echo "Entre a porta do servidor:"
read port
echo "Entre o JWT secret key:"
read jwt
echo "Entre o email:"
read email
echo "Entre a senha do email:"
read senha
echo "Entre a URL do banco de dados:"
read database
echo "Entre o email do admin do banco de dados:"
read usuario_base
echo "Entre a senha do admin do banco de dados:"
read senha_base
echo "JWT_SECRET=$jwt" >  ./backend/.env
echo "DATABASE_URL=$database" >> ./backend/.env
echo "port=$port" >> ./backend/.env
echo "SMTP_EMAIL='$email'" >> ./backend/.env
echo "SMTP_SENHA='$senha'" >> ./backend/.env
echo "ADMIN_EMAIL='$usuario_base'" >> ./backend/.env
echo "ADMIN_SENHA='$senha_base'" >> ./backend/.env
echo "VITE_URL=http://localhost:$port" >  ./frontend/.env

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
npm install
npm run build
cd ..
cp -R frontend/dist/* backend/public/

# pm2
npm install pm2@latest -g
cd backend
pm2 delete all
pm2 start servidor.js -i max
pm2 startup
pm2 save


