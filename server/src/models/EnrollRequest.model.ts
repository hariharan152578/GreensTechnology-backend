import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "enroll_requests" })
export class EnrollRequest extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @Column
  email!: string;

  @Column
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
