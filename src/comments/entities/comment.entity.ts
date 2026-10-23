import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Comments {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;
}
