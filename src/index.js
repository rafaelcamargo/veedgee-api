const app = require('./web');
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Running application on http://localhost:${PORT}`);
});
