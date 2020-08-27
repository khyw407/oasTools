require('dotenv').config();
const fs = require('fs');
const http = require('http');
const path = require('path');
const express = require('express');
const oasTools = require('oas-tools');
const jsyaml = require('js-yaml');
const helmet = require('helmet');

const logger = require('./config/winston');

const app = express();
app.use(express.json());
app.use(helmet());
const serverPort = process.env.PORT || 8080;

const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
const oasDoc = jsyaml.safeLoad(spec);

const optionsObject = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: process.env.LOG_LEVEL || 'info',
  strict: false,
  router: true,
  validator: true,
};

oasTools.configure(optionsObject);

oasTools.initialize(oasDoc, app, () => {
  http.createServer(app).listen(serverPort, () => {
    logger.debug(`App running at http://localhost:${serverPort}`);
    logger.debug('________________________________________________________________');
    if (optionsObject.docs !== false) {
      logger.debug(`API docs (Swagger UI) available on http://localhost:${serverPort}/docs`);
      logger.debug('________________________________________________________________');
    }
  });
});

app.get('/info', (req, res) => {
  res.send({
    info: 'This API was generated using oas-generator!',
    name: oasDoc.info.title,
  });
});
