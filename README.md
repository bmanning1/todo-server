NOTES:

To create a node server, create a folder and then run `npm init` when you're in that directory.

# ES6
To use ES6 (like import etc.) add the following property to package.json
```
"type": "module"
```
and then change the start script to the following
```
node --experimental-modules index.js
```