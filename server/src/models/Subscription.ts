import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface SubscriptionAttributes {
  id: number;
  email: string;
  isActive: boolean;
}

interface SubscriptionCreationAttributes
  extends Optional<SubscriptionAttributes, "id" | "isActive"> {}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes {
  public id!: number;
  public email!: string;
  public isActive!: boolean;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
  }
);

export default Subscription;
