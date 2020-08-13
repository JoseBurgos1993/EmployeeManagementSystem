drop employees if exists;

create database employees;

use employees;

create table employee{
    id int auto increment primary key,
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
};

create table department{
    id int primary key,
    name varchar(30)
};

create table role{
    id int primary key,
    title varchar(30),
    salary decimal,
    department_id int foreign key
};
