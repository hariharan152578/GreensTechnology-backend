// src/models/ModuleTopic.model.ts
import {
  Table,
  Column,
  Model,
  ForeignKey,
} from "sequelize-typescript";
import { Module } from "./Module.model";

@Table({ tableName: "module_topics" })
export class ModuleTopic extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Module)
  @Column
  moduleId!: number;

  @Column
  title!: string;

  @Column({ defaultValue: true })
  isActive!: boolean;
}
