import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { UserType } from '../../common.enum';
import { UserEntity } from './user';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  DOJ!: string;

  @OneToOne(
    () => require("./user").UserEntity,
    (user: any) => user.employee,
    { cascade: ["insert"] }
  )
  user!: InstanceType<typeof import("./user").UserEntity>;
}

