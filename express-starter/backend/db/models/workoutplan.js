'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkoutPlan extends Model {
    static associate(models) {
      // Define association with User model
      WorkoutPlan.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    }
  }

  WorkoutPlan.init({
    id: {
      type: DataTypes.INTEGER,  
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,  
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    goal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    training_days_per_week: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    plan_details: {
      type: DataTypes.JSON,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image_url_1: {
      type: DataTypes.STRING, 
      allowNull: true 
    },
    image_url_2: {
      type: DataTypes.STRING, 
      allowNull: true 
    }
  }, {
    sequelize,
    modelName: 'WorkoutPlan',
    tableName: 'WorkoutPlans',
    timestamps: false
  });

  return WorkoutPlan;
};