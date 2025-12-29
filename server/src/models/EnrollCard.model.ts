import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "enroll_cards" })
export class EnrollCard extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ defaultValue: 0 })
  domainId!: number;

  @Column({ defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  image!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
