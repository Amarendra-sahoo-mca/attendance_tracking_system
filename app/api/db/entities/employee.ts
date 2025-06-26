import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { UserType } from '../../common.enum';
import { UserEntity } from './user';

@Entity('employee')
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  DOJ!: string;

  @Column()
  employee_id!: string;

  @OneToOne(
    () => require("./user").UserEntity,
    (user: any) => user.employee,
    { cascade: true }
  )
  @JoinColumn({ name: "user_id" })
  user!: InstanceType<typeof import("./user").UserEntity>;

  @OneToMany(
    () => require("./attendance").AttendanceEntity,
    (user: any) => user.employee
  )
  @JoinColumn({ name: "user_id" })
  attendance!: InstanceType<typeof import("./attendance").AttendanceEntity>;
}

