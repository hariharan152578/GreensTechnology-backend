import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "mail" })
export class Contact extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  email!: string;

  @Column({ type: DataType.STRING })
  fullName!: string;

  @Column({ type: DataType.STRING })
  phone!: string;

  // "GENERAL" = Footer, "COURSE" = Enquiry Form
  @Column({ type: DataType.ENUM("GENERAL", "COURSE"), allowNull: false })
  contactType!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  domainId!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  courseId!: number;
}