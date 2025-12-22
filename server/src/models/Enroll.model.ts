import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from "sequelize-typescript";
import { EnrollCard } from "./EnrollCard.model";

@Table({ tableName: "enroll_sections" })
export class Enroll extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ defaultValue: 0 })
  domainId!: number;

  @Column({ defaultValue: 0 })
  courseId!: number;

  @Column
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column
  ctaText!: string;

  @Column
  ctaLink!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;

  @HasMany(() => EnrollCard)
  cards!: EnrollCard[];
}
