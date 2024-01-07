Started with open source code from: https://iotawise.rdev.pro/

## Running Locally

1. Clone the repository.

```bash
git clone https://github.com/zer0dt/simply-stream.git
cd simply-stream
```

2. Install dependencies using npm.

```bash
npm install
```
3. Install Scrypt-CLI, Initialize, and Build Contract

```bash
npm install -g scrypt-cli
npx scrypt-cli init
npm run build:contract
```

4. Copy `env.example` to `env` and update the variables (change the DATABASE_URL to your postgres instance)

```bash
cp .env.example .env
``` 

5. Generate prisma client before starting development server.

```bash
npm run postinstall
```

6. Start the development server.

```bash
npm run dev
```

