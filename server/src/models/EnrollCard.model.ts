import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Enroll } from "./Enroll.model";

@Table({ tableName: "enroll_cards" })
export class EnrollCard extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Enroll)
  @Column
  enrollSectionId!: number;

  @Column
  title!: string;

  @Column(DataType.STRING)
  imageUrl!: string;

  @Column({ defaultValue: 0 })
  order!: number;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
