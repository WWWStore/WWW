'use strict';
/**
 * Combines SuperTest and Mongoose Memory Server
 * to reduce (hopefully) the pain of
 * testing a Mongoose API
 */

const mongoose = require('mongoose');
const { default: MongoMemoryServer } = require('mongodb-memory-server');
module.exports = require('supertest');

let mongoServer;

async function startDB() {
  mongoServer = new MongoMemoryServer();

  const mongoUri = await mongoServer.getConnectionString();

  const mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
  };

  await mongoose.connect(mongoUri, mongooseOptions);
}

async function stopDB() {
  await mongoose.disconnect();
  mongoServer && await mongoServer.stop();
}

beforeAll(startDB);
afterAll(stopDB);

if (!module.parent) {
  describe('supergoose', () => {
    it('can connect', async () => {
      expect(mongoose.connection.db).toBeDefined();
    });
  });
}
