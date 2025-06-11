import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('holidays')
export class HolidaysEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  date!: string;

  @Column()
  endDate!: string;

  @Column()
  year!: string;
}