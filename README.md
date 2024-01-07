git clone https://github.com/zer0dt/simply-stream.git

cd simply-stream

npm install

mv env.example .env 

in .env, change the DATABASE_URL to your instance

npm install -g scrypt-cli

npm run build:contract

npm run dev

