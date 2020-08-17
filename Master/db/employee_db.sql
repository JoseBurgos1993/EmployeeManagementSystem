drop database if exists employees;

create database employees;

use employees;

create table department(
    id int auto_increment primary key,
    name varchar(30) not null
);

create table role(
    id int auto_increment primary key,
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null,
    constraint `fk_department_id`
    foreign key (department_id)
    references department(id) on update cascade on delete restrict
);

create table employee(
    id int auto_increment primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    manager_id int,
    constraint `fk_role_id`
    foreign key (role_id)
    references role(id) on update cascade on delete restrict,
    constraint `fk_manager_id`
    foreign key (manager_id)
    references employee(id) on update cascade on delete restrict
);