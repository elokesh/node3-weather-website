const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const path = require('path');
const express = require('express');
const hbs = require('hbs');




const app = express();
const port = process.env.PORT || 3000;

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
     res.render('index', {
          title: 'Weather app',
          name: 'Lokesh'
     });
})

app.get('/help', (req, res) => {
     res.render('help', {
          helpText: "This is some helpful text.",
          title: "Help",
          name: "Lokesh"
     });
})

app.get('/about', (req, res) => {
     res.render('about', {
          title: "About me",
          name: "Lokesh"
     })
})

app.get('/weather', (req, res) => {
     if (!req.query.address) {
          return res.send({
               error: "Address must be provided"
          });
     }
     geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
          if (error) {
               return res.send({
                    error: error
               })
          }

          forecast(latitude, longitude, (error, forecastData) => {
               if (error) {
                    return res.send({
                         error: error
                    })
               }
               res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
               })
          })
     })
})

app.get('/products', (req, res) => {
     if (!req.query.search) {
          return res.send({
               error: "You must provide a search term"
          });
     }

     console.log(req.query);
     res.send({
          products: []
     })
})

app.get("/help/*splat", (req, res) => {
     res.render("404", { errorMsg: "Help article not found", name: "Lokesh", title: "404" });
})

app.use((req, res) => {
     res.render("404", { errorMsg: "My 404 page", name: "Lokesh", title: "404" });
})

app.listen(port, () => {
     console.log('Server is listening');
})


/*
Notes:
## Creating Your First Node.js Server with Express (Summary)

- Node.js servers let users interact via URLs instead of terminal commands.
- Servers can serve static websites (HTML, CSS, JS, images) or JSON-based APIs.
- Express is a popular npm library that simplifies creating Node.js web servers.
- Project setup involves initializing npm, installing Express, and organizing code in an `src` folder.
- An Express app is created by calling the `express()` function.
- Routes are defined using `app.get(route, handler)` to handle specific URLs.
- Responses are sent using `res.send()` (text, HTML, or JSON).
- The server is started with `app.listen(port, callback)` (commonly port 3000 for development).
- The server keeps running to handle incoming requests until manually stopped.
- Tools like `nodemon` auto-restart the server on file changes.
- Multiple routes (`/`, `/help`, `/about`, `/weather`) can be handled by the same server.
- Unhandled routes return a default “Cannot GET /route” error (custom 404s come later).
-----------------------------------------------------------------

# Serving Static Files with Express (Crisp Notes)

## Problem with Inline HTML
- Sending HTML as strings in Express gets messy as pages grow.
- Better approach: keep HTML in separate files.

## Goal
- Configure Express to serve a **static directory** containing:
  - HTML files
  - CSS
  - Client-side JavaScript
  - Images, videos, etc.

## Public Directory
- Create a folder named **`public`** at project root (alongside `node_modules` and `src`).
- Any file inside `public` is accessible via the browser.
- Add `index.html` (special file served by default at root `/`).


## Absolute Path Requirement
- Express static needs an **absolute path**, not a relative path.

## Node.js Globals
- `__dirname` → absolute path of the current directory.
- `__filename` → absolute path of the current file.
- Provided by Node’s wrapper function.

## Using `path` Module
- Core Node module (no install needed).
- Import: `const path = require('path')`
- Use `path.join()` for safe, cross-OS path handling.

## Building Public Directory Path
- Start from `__dirname` (points to `src`).
- Go up one level and into `public`:
  - `path.join(__dirname, '..', 'public')`

## Serving Static Files
- Add after creating Express app:
  - `app.use(express.static(publicDirectoryPath))`
- This tells Express to serve everything inside `public`.

## Result
- Visiting `localhost:3000/` loads `public/index.html`.
- `index.html` auto-loads at root (no need to type filename).
- Can also access directly: `/index.html`.

## Route Handler Impact
- `express.static` matches requests first.
- Old route handlers for `/`, `/about`, `/help` won’t run.
- Safe to remove those routes if replaced by static HTML.

## Outcome
- Website assets now live in a static directory.
- Express cleanly serves HTML and other assets.
- Next step: add CSS, client-side JS, images, etc.

- The main goal is to let users fetch weather forecasts via a browser URL instead of terminal commands.
- A `/weather` route will accept a user’s address and return forecast data as JSON.
- Query strings (`?key=value`) are used to send extra data (like address or search terms) from the browser to the server.
- Express parses query strings and exposes them through `req.query` as an object.
- A demo `/products` route shows how query strings like `search` and `rating` work.
- Required query parameters must be validated using `if` conditions.
- Sending multiple responses causes the error: **“Cannot set headers after they are sent to the client”**, fixed using `return` or `else`.
- The `/weather` route is updated to require an `address`, return errors if missing, and echo the address back in the response.

*/