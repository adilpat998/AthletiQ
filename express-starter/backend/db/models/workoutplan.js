module.exports = (sequelize, DataTypes) => {
  const WorkoutPlan = sequelize.define('WorkoutPlan', {
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
