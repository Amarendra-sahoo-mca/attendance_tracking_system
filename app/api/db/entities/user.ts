import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserType } from '../../common.enum';
import { EmployeeEntity } from './employee';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  password!: string;

  @Column({ unique: true })
  email!: string;

  @Column({
    type:'enum',
    enum:UserType,
    default:UserType.EMPLOYEE,
    comment: '1-ADMIN 2-EMPLOYEE'
  })
  type!:UserType;

  @OneToOne(
    () => require("./employee").EmployeeEntity,
    (employee: any) => employee.user,
    { nullable: true,onDelete: "CASCADE" }
  )
  employee!: InstanceType<typeof import("./employee").EmployeeEntity>;
}

