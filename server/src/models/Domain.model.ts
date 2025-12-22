import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "domains" })
export class Domain extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ allowNull: false })
  domain!: string; // DevOps, AWS, Linux

  @Column({ allowNull: false })
  title!: string;

  @Column({ allowNull: false })
  subtitle!: string;

  @Column({ allowNull: false })
  price!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  description!: string;

  @Column({ allowNull: false })
  mainImageUrl!: string;

  @Column({ allowNull: false })
  smallImageUrl!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
