import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("shows")
export class ShowEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  genre: string;

  @Column()
  date: string;

  @Column()
  totalSeats: number;

  @Column()
  availableSeats: number;

  @Column("float")
  ticketPrice: number;
}
