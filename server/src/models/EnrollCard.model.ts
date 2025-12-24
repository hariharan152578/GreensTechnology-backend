import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType,
  BelongsTo,
} from "sequelize-typescript";
import { Enroll } from "./Enroll.model";

@Table({
  tableName: "enroll_cards",
  timestamps: true,
})
export class EnrollCard extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Enroll)
  @Column({
    allowNull: false,
  })
  enrollSectionId!: number;

  @BelongsTo(() => Enroll)
  enrollSection!: Enroll;

  @Column({
    allowNull: false,
  })
  title!: string;

  @Column(DataType.STRING)
  imageUrl!: string;

  @Column({
    defaultValue: 0,
  })
  order!: number;

  @Column({
    defaultValue: true,
  })
  isActive!: boolean;
}
