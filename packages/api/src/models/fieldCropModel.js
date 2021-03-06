/* 
 *  Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>   
 *  This file (fieldCropModel.js) is part of LiteFarm.
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


class FieldCrop extends Model {
  static get tableName() {
    return 'fieldCrop';
  }

  static get idColumn() {
    return 'field_crop_id';
  }
  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        field_crop_id: { type: 'integer' },
        crop_id: { type: 'integer' },
        field_id: { type: 'string' },
        variety: { type: 'string' },
        start_date: { type: 'date-time' },
        end_date: { type: 'date-time' },
        area_used: { type: 'float' },
        estimated_production: { type: 'float' },
        estimated_revenue: { type: 'float' },
        is_by_bed: { type: 'boolean' },
        bed_config: { type: 'object, null' },
      },
    };
  }
  static get relationMappings() {
    // Import models here to prevent require loops.
    return {
      farm: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: require('./fieldModel.js'),
        join: {
          from: 'fieldCrop.field_id',
          to: 'field.farm_id',
        },
      },
      crop:{
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: require('./cropModel.js'),
        join: {
          from: 'fieldCrop.crop_id',
          to: 'crop.crop_id',
        },
      },
      activityLog:{
        relation:Model.ManyToManyRelation,
        modelClass:require('./activityLogModel.js'),
        join:{
          to: 'activityLog.activity_id',
          through:{
            from:'activityCrops.activity_id',
            to:'activityCrops.field_crop_id',
          },
          from:'fieldCrop.field_crop_id',
        },
      },
    };
  }
}

module.exports = FieldCrop;
