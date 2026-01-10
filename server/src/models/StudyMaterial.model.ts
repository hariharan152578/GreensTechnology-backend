import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "study_materials" })
export class StudyMaterial extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ defaultValue: 0 })
  domainId!: number;

  @Column({ defaultValue: 0 })
  courseId!: number;

  @Column({ allowNull: false })
  fileName!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({ allowNull: false })
  fileType!: "PDF" | "DOCX" | "VIDEO" | "PRESENTATION" | "EBOOK";

  @Column({ allowNull: false })
  highlight!: string;

  /* 🔥 MAIN FILE PATH */
  @Column({ allowNull: false })
  filePath!: string;

  /* 🖼️ NEW: THUMBNAIL IMAGE PATH */
  @Column({ allowNull: true })
  thumbnailPath!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
