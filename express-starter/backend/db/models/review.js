'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Each review belongs to a workout plan and a user
      Review.belongsTo(models.WorkoutPlan, {
        foreignKey: 'workout_id',
        onDelete: 'CASCADE',
      });
      Review.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Review',
      tableName: 'Reviews',
      createdAt: 'created_at',
      updatedAt: false,
      defaultScope: {
        attributes: { exclude: ['user_id', 'workout_id'] },
      },
    }
  );
  return Review;
};
