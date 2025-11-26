import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { MenuEntity } from './menu.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 180, unique: true })
  code!: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 16 })
  type!: 'MENU' | 'ACTION';

  @Column({ length: 255, nullable: true })
  resource?: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ length: 200, nullable: true })
  messageKey?: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.permissions)
  menus!: MenuEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
