module.exports = (sequelize, DataTypes) => {
  const WorkoutPlan = sequelize.define('WorkoutPlan', {
    id: {
      type: DataTypes.INTEGER,  // Changed from UUID to INTEGER
      allowNull: false,
      autoIncrement: true,  // Enable auto-increment
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,  // Ensure it matches Users.id
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
    }
  }, {
    tableName: 'WorkoutPlans',
    timestamps: false
  });

  WorkoutPlan.associate = (models) => {
    WorkoutPlan.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  return WorkoutPlan;
};
