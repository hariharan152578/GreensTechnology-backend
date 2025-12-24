import {
  Table,
  Column,
  Model,
  DataType,
} from "sequelize-typescript";

@Table({ tableName: "study_materials" })
export class StudyMaterial extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  // 🔥 FILTERING
  @Column({ defaultValue: 0 })
  domainId!: number; // 0 = all

  @Column({ defaultValue: 0 })
  courseId!: number; // 0 = all

  // 🔥 FILE INFO
  @Column({ allowNull: false })
  fileName!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ allowNull: false })
  fileType!: "PDF" | "DOCX" | "VIDEO" | "PRESENTATION" | "EBOOK";

  @Column({ allowNull: false })
  size!: string;

  @Column({ allowNull: false })
  highlight!: string;

  // 🔥 STORED FILE PATH
  @Column({ allowNull: false })
  filePath!: string; // uploads/enroll/xxx.pdf

  @Column({ defaultValue: true })
  isActive!: boolean;
}
