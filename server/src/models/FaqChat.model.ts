

import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "faq_chats" })
export class FAQChat extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ defaultValue: 0 })
  domainId!: number;

  @Column({ defaultValue: 0 })
  courseId!: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  question!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  answer!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  category?: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  likes!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  views!: number;
}