import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Crew } from './crew.entity';

@Entity()
export class Zone {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string; // Commercial, Residential, etc.

    @Column({ default: 'Active' })
    status: string;

    @OneToMany(() => Crew, (crew) => crew.zone)
    crews: Crew[];
}
