import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LeaveType } from "../../common.enum";

@Entity('leave_entitlements')
export class LeaveEntitlementsEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type:"enum",
    enum:LeaveType,
    default:LeaveType.Sickness,
    comment:"Vacation,Sickness,Maternity or Paternity,Compassionate,TOIL,Work From Home,Bank Holiday"
  })
  type!: string;

  @Column()
  theme!: string;

  @Column()
  days!: number;
}