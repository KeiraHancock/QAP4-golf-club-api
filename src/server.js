require('dotenv').config();
const app = require('./app');
const { initDb } = require('./models');

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database, exiting.', err);
    process.exit(1);
  });
