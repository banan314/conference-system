# node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku
if the app has not been created yet, type
`
$ heroku create
`
Otherwise go to the directory where you have your app and:
```
$ npm install
$ git add .
$ git commit -m "Demo"
$ git push heroku master
$ heroku open
```
In order to get it working, you must have at least 1 dyno. To check it, `heroku ps`; to change it, `heroku ps:scale web=1`. Troubleshooting: `heroku logs --tail`.
Find out more here:
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
