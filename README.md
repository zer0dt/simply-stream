Started with open source code from: https://iotawise.rdev.pro/

git clone https://github.com/zer0dt/simply-stream.git

cd simply-stream

npm install

npm install -g scrypt-cli

npm run build:contract

mv env.example .env 

in .env, change the DATABASE_URL to your instance

npm run dev

