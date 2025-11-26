import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120, unique: true })
  username!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 200, nullable: true })
  email?: string;

  @Column({ default: 'ACTIVE' })
  status!: 'ACTIVE' | 'LOCKED' | 'DISABLED';

  @Column({ name: 'login_fail_count', default: 0 })
  loginFailCount!: number;

  // DB 벤더별 호환을 위해 타입을 명시하지 않는다 (postgres/timestamptz, sqlite/datetime).
  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @Column({ length: 200, nullable: true })
  messageKey?: string;

  @ManyToMany(() => RoleEntity, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
