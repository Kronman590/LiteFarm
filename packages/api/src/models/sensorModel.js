/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (todoModel.js) is part of LiteFarm.
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

const Model = require('objection').Model;

class Sensor extends Model {
  static get tableName() {
    return 'sensor';
  }


  static get idColumn() {
    return 'sensor_id';
  }
  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      required: ['location', 'farm_id', 'field_id'],

      properties: {
        sensor_id: { type: 'string', minLength: 1, maxLength: 255 }, //generated id to identify sensor
        sensor_name: { type: 'string' }, //name of sensor for user to identify sensor
        location: { //geographical location of sensor in field
          type: 'object',
          required: ['lat', 'lng'],
          properties: {
            lat: { type: 'number' }, //latitude
            lng: { type: 'number' }, //longitude
          },
        },
        farm_id: { type: 'string', minLength: 1, maxLength: 255 }, //farm id that sensor is associated to
        field_id: { type: 'string', minLength: 1, maxLength: 255 }, //field id that sensor is associated to
      },
    };
  }

}

module.exports = Sensor;
