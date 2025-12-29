import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "enrollment_requests",
  timestamps: true,
})
export class EnrollmentRequest extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  id!: number;

  @Column({ type: DataType.INTEGER, field: 'domain_id' }) // Explicit DB column name
  domainId!: number;

  @Column({ type: DataType.STRING, field: 'domain_name' })
  domain!: string; 

  @Column({ type: DataType.INTEGER, field: 'course_id' })
  courseId!: number;

  @Column({ type: DataType.STRING, field: 'course_name' })
  course!: string; 

  @Column({ type: DataType.STRING, field: 'user_full_name' })
  name!: string;

  @Column({ type: DataType.STRING, field: 'user_email' })
  email!: string;

  @Column({ type: DataType.STRING, field: 'user_phone' })
  phone!: string;

  @Column({ type: DataType.STRING, field: 'proof_image_path' })
  proofImage!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "pending",
    field: 'request_status'
  })
  status!: string;
}