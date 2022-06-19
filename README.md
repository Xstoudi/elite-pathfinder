# Elite Pathfinder
## Requirements
  Node v17 or higher

## Getting started
### Server
Start by installing dependencies with:
```
npm i
```

when it's done, run the following command to fetch needed datas, it can take quite some time:
```
node ace fetch:systems
```

when the system are downloaded, extract the interesting datas:
```
node ace generate:sample
```

Now you're ready to run the server in development mode:
```
node ace serve --watch
```

### Client
Navigate in `front` folder and install dependencies with:
```
npm i
```

Copy and edit `.env` file with the serveur url:
```
cp .env.example .env
```

then start the client app:
```
npm start
```

The client is now up and running on [localhost:3000](https://localhost:3000).