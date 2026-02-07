import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Zone } from './zone.entity';

@Entity()
export class Crew {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    dateOfJoining: string;

    @ManyToOne(() => Zone, (zone) => zone.crews)
    zone: Zone;

    @Column()
    role: string; // Technician, Cleaner

    @Column({ default: 'Active' })
    status: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    scheduledHours: number;

    @Column({ type: 'int', default: 0 })
    efficiency: number;
}
