# Online Shop - API

> Backend API implementation of online shop application

## Available Endpoints

### Authenthication
- POST /api/singnup
- POST /api/signin

### ...

## Usage

> examples assume that you are in browser console 

### Sign up user

```javascript
fetch('/api/signup', {
    method: 'post',
    
    body: JSON.stringify({
        username: 'test',
        password: 'password',
        // optional oneOf('seller', 'buyer') default is buyer
        type: 'seller',
    }),
    
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Sign in to get token

```javascript
fetch('/api/signin', {
    method: 'post',
    
    body: JSON.stringify({
        username: 'test',
        password: 'password'
    }),
    
    headers: {
        'Content-Type': 'application/json',
    },
})
```

### Create Category

```javascript
fetch('/api/categories', {
    method: 'post',
    
    body: JSON.stringify({
        name: 'smarthphone',
    }),
    
    headers: {
        'Content-Type': 'application/json',
        'Authorization': '<jwt-token>',
    },
})
```

### Create Item

```javascript
fetch('/api/items', {
    method: 'post',
    
    body: JSON.stringify({
        name: 'Apple iPhone 13 pro',
        description: 'apple iphone 13 pro 128 gb...',
        price: 999.99,
        availableCount: 14,
        category: 1, // existing category id
        tags: ['phone', 'new'],
    }),
    
    headers: {
        'Content-Type': 'application/json',
        'Authorization': '<jwt-token>',
    },
})
```

## Setup

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

