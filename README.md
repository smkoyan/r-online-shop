# Online Shop - API

> Backend API implementation of online shop application

## Available Endpoints

### Authenthication
- POST /api/singnup
- POST /api/signin

### ...

## Usage

### Prerequisites
- Node.js (npm)
- MySQL Server (tested on version 8)

## Steps
1. clone project `git clone https://github.com/smkoyan/r-online-shop.git`
2. go to the project folder `cd r-online-shop`
3. install npm packages `npm i`
4. copy .env.example to .env `cp .env.example .env`
5. fill in the environment variables
6. run application `npm start` or `node server.js`


## Steps with Docker
1. clone project `git clone https://github.com/smkoyan/r-online-shop.git`
2. go to the project folder `cd r-online-shop`
3. build docker image `docker build . -t <username>/<app-name>`
4. run docker image passing environment variables `docker run -p <public-port>:<private-port> -d --env-file <env-file-name> <username>/<app-name>`

