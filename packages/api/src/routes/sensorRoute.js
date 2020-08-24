/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (farmRoute.js) is part of LiteFarm.
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

const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensorController');
const authFarmId = require('../middleware/acl/authFarmId');
const checkScope = require('../middleware/acl/checkScope');
const checkEditPrivilege = require('../middleware/acl/checkEditPrivilege');

router.get('/farm/:farm_id', authFarmId, checkScope(['get:sensor']), sensorController.getAllSensorsinFarm());

router.get('/field/:field_id', authFarmId, checkScope(['get:sensor']), sensorController.getAllSensorsinField());

router.get('/:sensor_id', authFarmId, checkScope(['get:sensor']), sensorController.getSensorbyID());

router.post('/', checkEditPrivilege, checkScope(['add:sensor']), sensorController.addSensor());

router.put('/:id', checkEditPrivilege, checkScope(['edit:sensor']), sensorController.updateSensor());

router.delete('/:id', checkEditPrivilege, checkScope(['delete:sensor']), sensorController.deleteSensor());

module.exports = router;

// checkEditPrivilege caused infinite loop during tests, intended to check if user can create/edit/delete things on given farm