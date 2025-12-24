import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "trainer_abouts" })
export class TrainerAbout extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  // 0 = landing
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  // 0 = domain-level
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  label!: string; // "Trainer Profile", "Meet Our Trainers"

  @Column({ allowNull: false })
  heading!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description1!: string;

  @Column({ type: DataType.TEXT })
  description2!: string;

  @Column({ type: DataType.JSON })
  mainImages!: string[];

  @Column({ type: DataType.JSON })
  smallImages!: string[];

  @Column({ defaultValue: true })
  isActive!: boolean;
}
