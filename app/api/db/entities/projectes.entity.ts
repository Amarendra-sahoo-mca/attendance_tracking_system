import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LeaveType } from "../../common.enum";

@Entity('projects')
export class ProjectsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  start_date!: string;

  @Column()
  end_date!: string;

  @Column()
  cost!: number;
}