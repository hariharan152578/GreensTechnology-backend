import { Table, Column, Model } from "sequelize-typescript";

@Table({ tableName: "enrollment_requests" })
export class EnrollmentRequest extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  domainId!: number;

  @Column
  courseId!: number;

  @Column
  name!: string;

  @Column
  email!: string;

  @Column
  phone!: string;

  @Column
  course!: string;

  @Column
  proofImage!: string;

  @Column({ defaultValue: "pending" })
  status!: string;
}
