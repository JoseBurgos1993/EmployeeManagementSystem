const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Hikarugi1",
    database: "employees"
});

connection.connect(function(err) {
    if (err) throw err;
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
        "Add a new employee",
        "Add a new role",
        "Add a new department",
        "View a table",
        "Update employee role",
        "Exit"
        ]
    }).then(function(answer) {
        switch (answer.action) {
        case "Add a new employee":
            addEmployee();
            break;

        case "Add a new role":
            addRole();
            break;

        case "Add a new department":
            AddDepartment();
            break;

        case "View a table":
            viewTable();
            break;
        
        case "Update employee role":
            updateRole();
            break;

        case "exit":
            connection.end();
            break;
        }
    });
}

function addEmployee(){
    let first_name;
    let last_name;
    let role;
    let manager;

    const managerList = ["NONE"];
    const roleList = [];

    connection.query("SELECT first_name FROM employee", function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            managerList.push(res[i].first_name); 
        }
    });

    connection.query("SELECT title FROM role", function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            roleList.push(res[i].title); 
        }
    });

    inquirer.prompt(
        {
            name: "first_name",
            type: "input",
            message: "What is this person's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is this person's first name?"
        },
        {
            name: "role",
            type: "input",
            message: "What is this person's role?",
            choices: roleList
        },
        {
            name: "manager",
            type: "input",
            message: "Who is this person's manager? (Select NONE if no manager)",
            choices: managerList
        }
    ).then(function(answer){

    });





}

function addRole(){
    console.log("ADDD ROLE");
    mainMenu();
}

function AddDepartment(){
    console.log("ADDD DEP");
    mainMenu();
}

function viewTable(){
    console.log("VIEW TABLE CLJLJs");
    mainMenu();
}

function updateRole(){
    let employeeList = [];
    let roleList = [];
    const query = "SELECT first_name FROM employee";
    connection.query(query, function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            employeeList.push(res[i].first_name);
        }
        connection.query("SELECT title FROM role", function(err2,res2){
            if(err2) throw err2;
            for(let i = 0; i < res.length; i++){
                roleList.push(res2[i].title);
            }
            testFunction(employeeList);
        });
    });
}

function testFunction(employeeList){
    inquirer.prompt(
        {
            name: "name",
            type: "list",
            message: "Select an employee:",
            choices: employeeList
        },
        {
            name: "role",
            type: "list",
            message: "Select a new role:",
            choices: roleList
        }
    ).then(function(answer){
        connection.query("SELECT id FROM role WHERE title = ?", answer.role, function(err,res){
            if(err) throw err;
            const id = res.id;
            connection.query("UPDATE employee SET role = answer.role", function(err2,res2){
                if(err2) throw err2;
                for(let i = 0; i < res.length; i++){
                    roleList.push(res2[i].title);
                }
                mainMenu();
            });
        });
    });
}