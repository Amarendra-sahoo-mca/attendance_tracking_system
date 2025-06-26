import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("attendance")
export class AttendanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  absence_type!: string;

  @Column()
  start_date!: string;

  @Column()
  end_date!: string;

  @Column()
  description!: string;

  @Column()
  is_half_day!: boolean;

  @Column()
  year!: number;

  @ManyToOne(
    () => require("./employee").EmployeeEntity,
    (employee: any) => employee.attendance,
    { nullable: true, onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "employee_id" })
  employee!: InstanceType<typeof import("./employee").EmployeeEntity>;
}
