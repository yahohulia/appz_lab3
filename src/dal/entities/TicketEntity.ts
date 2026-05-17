import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("tickets")
export class TicketEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  showId: string;

  @Column()
  buyerName: string;

  @Column()
  seatNumber: number;

  @Column()
  purchaseDate: string;

  @Column("float")
  pricePaid: number;

  @Column()
  isReturned: boolean;
}
