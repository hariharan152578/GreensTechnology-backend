import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "faq_chats" })
export class FaqChat extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // Step index (0,1,2...)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  step!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  question!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  answer!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;
}
