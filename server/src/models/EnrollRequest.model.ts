import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({
  tableName: "enroll_requests",
  timestamps: true,
})
export class EnrollRequest extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    allowNull: false,
  })
  name!: string;

  @Column({
    allowNull: false,
  })
  email!: string;

  @Column({
    allowNull: false,
  })
  phone!: string;

  @Column
  course!: string;

  @Column
  domainId!: number;

  @Column
  courseId!: number;

  @Column(DataType.STRING)
  proofImage!: string;
}
