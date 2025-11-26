import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { MenuEntity } from './menu.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120, unique: true })
  name!: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ name: 'is_system_default', default: false })
  isSystemDefault!: boolean;

  @Column({ length: 200, nullable: true })
  messageKey?: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles, { cascade: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: PermissionEntity[];

  @ManyToMany(() => MenuEntity, (menu) => menu.roles, { cascade: true })
  @JoinTable({
    name: 'role_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus!: MenuEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users!: UserEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
