/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (sensorAPI.test.js) is part of LiteFarm.
 *  
 *  LiteFarm is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  LiteFarm is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details, see <https://www.gnu.org/licenses/>.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chai_assert = chai.assert;    // Using Assert style
const chai_expect = chai.expect;    // Using Expect style
const chai_should = chai.should();  // Using Should style
const server = 'http://localhost:5000';
const dummy = require('./dummy');

const mockSensor = {
  location:
    { lat:1, lng:2 },
};

const mockSensor2 = {
  location:
    { lat:3, lng:2 },
};


beforeAll(() => {
  // beforeAll is set before each test
  // global.token is set in testEnvironment.js
  token = global.token;
});

describe('Testing sensor API', () => {

  let farm_id = null, sensor_id, field_id = null;

  test('POST farm happy land to DB to setup test', (done) => {
    chai.request(server).post('/farm')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .send(dummy.mockFarm)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(201);
        chai.expect(res.body).to.have.property('farm_id');
        farm_id = res.body.farm_id;
        done();
      });
  });

  test('POST field in happy land to DB to setup test', (done) => {
    chai.request(server).post('/field')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .send(dummy.mockField)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(201);
        chai.expect(res.body).to.have.property('field_id');
        field_id = res.body.field_id;
        done();
      });
  });

   test('POST a sensor to DB', (done) => {
    let sensor = mockSensor;
    sensor.farm_id = farm_id;
    sensor.field_id = field_id;
    chai.request(server).post('/sensor')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .send(sensor)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        console.log("Post error: ", res.body, " ...", token);
        chai_expect(res.status).to.equal(201);
        chai.expect(res.body).to.have.property('sensor_id');
        sensor_id = res.body.sensor_id;
        done();
      });
  });

  test('GET sensors associated with farm id from DB', (done) => {
    chai.request(server).get('/sensor/farm/' + farm_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(200);
        chai_expect(res.body.length).to.equal(1);
        chai_expect(res.body[0].sensor_id).to.equal(sensor_id);
        done();
      });
  });

  test('GET sensors associated with field id from DB', (done) => {
    chai.request(server).get('/sensor/field/' + field_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(200);
        chai_expect(res.body.length).to.equal(1);
        chai_expect(res.body[0].sensor_id).to.equal(sensor_id);
        done();
      });
  });

  test('GET sensors using sensor id from DB', (done) => {
    chai.request(server).get('/sensor/' + sensor_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(200);
        chai_expect(res.body.length).to.equal(1);
        chai_expect(res.body[0].sensor_id).to.equal(sensor_id);
        done();
      });
  });

  test('PUT sensor 123 with new lat', (done) => {
    let sensor = mockSensor2;
    sensor.farm_id = farm_id;
    chai.request(server).put('/sensor/' + sensor_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .send(sensor)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(200);
        chai_expect(res.body[0].location.lat).to.equal(3);
        done();
      });
  });

  test('PUT sensor baa15588-4ddb-4ab1-b33e-f3e0a66966ea(does not exist)', (done) => {
    let sensor = mockSensor;
    sensor.farm_id = farm_id;
    chai.request(server).put('/sensor/baa15588-4ddb-4ab1-b33e-f3e0a66966ea')
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .send(sensor)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(401);
        done();
      });
  });

  test('DELETE sensor should get 200' , (done) => {
    chai.request(server).del('/sensor/' + sensor_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(200);
        done();
      });
  });

  test('GET sensor 123 should get 404' , (done) => {
    chai.request(server).get('/sensor/' + sensor_id)
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer '+token)
      .end((err, res) => {
        chai_expect(err).to.be.null;
        chai_expect(res.status).to.equal(404);
        done();
      });
  });
});
