const express = require('express')
const nunjucks = require('nunjucks')
const minifyHTML = require("express-minify-html-2");
const minify = require("express-minify");
const compression = require("compression");

const app = express();
app.disable("x-powered-by");
app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(compression());
app.use(
  minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true,
    },
  })
);

app.use(
  minify({
    cache: false,
    uglifyJsModule: null, 
    errorHandler: null,
    jsMatch: /js/,
    cssMatch: /css/,
  })
);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

const PORT = process.env.port || 3000;

app.get('/about', (req, res) => {
  res.render('about.njk');
});


 
app.get("/", (req, res) => {
  res.render("index.njk");
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});