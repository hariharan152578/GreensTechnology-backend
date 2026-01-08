import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "trainer_abouts" })
export class TrainerAbout extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  label!: string;

  @Column({ allowNull: false })
  heading!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description1!: string;

  @Column({ type: DataType.TEXT })
  description2!: string;

  @Column({ type: DataType.JSON })
  mainImages!: string[];



  @Column({ defaultValue: true })
  isActive!: boolean;
}
