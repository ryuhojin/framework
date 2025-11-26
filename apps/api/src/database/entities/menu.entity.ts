import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { RoleEntity } from './role.entity';

@Entity({ name: 'menus' })
export class MenuEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ length: 255 })
  path!: string;

  @Column({ default: 0 })
  depth!: number;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder!: number;

  @Column({ length: 120, nullable: true })
  icon?: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ length: 200, nullable: true })
  messageKey?: string;

  @ManyToOne(() => MenuEntity, (menu) => menu.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: MenuEntity | null;

  @OneToMany(() => MenuEntity, (menu) => menu.parent)
  children?: MenuEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.menus, { cascade: true })
  @JoinTable({
    name: 'menu_permissions',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions!: PermissionEntity[];

  @ManyToMany(() => RoleEntity, (role) => role.menus)
  roles!: RoleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
