module.exports = {
  content: ["./views/**/*.{html,njk}", "./public/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
};

module.exports = {
  darkMode: 'class', // or 'media' if you prefer system preference
  content: [
    "./views/**/*.{njk,html}",
    "./public/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
