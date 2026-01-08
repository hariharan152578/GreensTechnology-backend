import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "domains" })
export class Domain extends Model {
  /* ---------- PRIMARY KEY ---------- */
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  /* ---------- DOMAIN / COURSE MAPPING ---------- */
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number; // 0 = landing, 1 = DevOps, 2 = AWS, etc.

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number; // 0 = domain-level

  /* ---------- CONTENT ---------- */
  @Column({ allowNull: false })
  domain!: string;

  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  subtitle!: string;

  @Column({ allowNull: false })
  price!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  /* ---------- IMAGES ---------- */
  @Column({ allowNull: false })
videoUrl!: string;

  /* ---------- STATUS ---------- */
  @Column({ defaultValue: true })
  isActive!: boolean;
}
