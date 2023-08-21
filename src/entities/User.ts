import { Entity, Column } from "typeorm"
// const { Entity, Column } = require("typeorm");
// import Entity from 'typeorm';
// const { Entity, Column, PrimaryGeneratedColumn } = require("typeorm");

// import { Entity, Column } from "typeorm";


@Entity()

export class User {
    @Column()
    id: number

    @Column()
    login: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    user_name: string

    @Column()
    email: string
    
    @Column()
    password: string

    @Column()
    last_artical_id: string
    
    @Column()
    verify_code: string
    
    @Column()
    amember_id: string
    
    @Column()
    pic: string
    
    @Column()
    login_type: string
}