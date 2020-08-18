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
        "View employees",
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

        case "View employees":
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

// This is split into the 2 functions addEmployee() and addEmployee2() for size and sync reasons
function addEmployee(){
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

    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is this person's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is this person's last name?"
        },
        {
            name: "role",
            type: "list",
            message: "What is this person's role?",
            choices: roleList
        },
        {
            name: "manager",
            type: "list",
            message: "Who is this person's manager? (Select NONE if no manager)",
            choices: managerList
        }
    ]).then(function(answer){
        let role_id;
        connection.query("SELECT id FROM role WHERE title = '" + answer.role+"'", function(err,res){
            if(err) throw err;
            role_id = res[0].id;
            addEmployee2(answer,role_id);
        });
        
    });
}

function addEmployee2(answer,role_id){
    if(answer.manager == "NONE"){
        const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES('${answer.first_name}','${answer.last_name}','${role_id}')`;

        connection.query(query, function(err2,res){
            if(err2) throw err2;
            console.log("Employee successfully added!")
            mainMenu();
        });

    } else{
        connection.query(`SELECT id FROM employee WHERE first_name = '${answer.manager}'`, function(err,res){
            if(err) throw err;
            const manager_id = res[0].id;

            const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES('${answer.first_name}','${answer.last_name}','${role_id}','${manager_id}')`;

            connection.query(query, function(err2,res2){
                if(err2) throw err2;
                console.log("Employee successfully added!")
                mainMenu();
            });
        });
    }
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
    const query = "SELECT first_name, last_name, title, salary, name as department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id"
    connection.query(query, function(err,res){
        if(err) throw err;
        let table = cTable.getTable(res);
        console.log(table);
        mainMenu();
    });
    
}
/*
SELECT first_name, last_name, title, salary, name
FROM employee
join role on employee.role_id = role.id
join department on role.department_id = department.id;
*/
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
    inquirer.prompt([
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
    ]).then(function(answer){
        connection.query("SELECT id FROM role WHERE title = ?", answer.role, function(err,res){
            if(err) throw err;
            const id = res[0].id;
            connection.query("UPDATE employee SET role = ? WHERE role.id = ?", function(err2,res2){
                if(err2) throw err2;
                for(let i = 0; i < res.length; i++){
                    roleList.push(res2[i].title);
                }
                mainMenu();
            });
        });
    });
}