import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Domain } from "./Domain.model";

@Table({ tableName: "courses" })
export class Course extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({ allowNull: false })
  name!: string; // Docker, Kubernetes, Terraform

  @Column({ allowNull: false })
  slug!: string; // docker, kubernetes

  @ForeignKey(() => Domain)
  @Column
  domainId!: number;

  @BelongsTo(() => Domain)
  domain!: Domain;
}
