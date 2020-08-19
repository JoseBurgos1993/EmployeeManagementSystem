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
        "View roles",
        "View Departments",
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
        
        case "View roles":
            viewRoles();
            break;

        case "View Departments":
            viewDepartments();
            break;

        case "Update employee role":
            updateRole();
            break;

        case "Exit":
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
    connection.query("Select name from department", function(err,res){
        if(err) throw err;
        let departmentList = [];
        for(i = 0; i < res.length; i++){
            departmentList.push(res[i].name);
        }
        inquirer.prompt([
            {
                name: "role",
                type: "input",
                message: "What is the name of this new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?"
            },
            {
                name: "department",
                type: "list",
                message: "Which department does this role belong to?",
                choices: departmentList
            }
        ]).then(function(answer){
            if(isNaN(answer.salary)){
                console.log("Not valid input for salary. Try again.");
                mainMenu();
            } else{
                for(let i = 0; i < departmentList.length; i++){
                    if(departmentList[i] == answer.department){
                        connection.query(`INSERT INTO role (title,salary,department_id) VALUES ('${answer.role}',${answer.salary},${i+1})`, function(err){
                            if(err) throw err;
                            console.log("Role successfully added!");
                            mainMenu();
                        });
                    }
                }
            }
        });
    });
}

function AddDepartment(){
    inquirer.prompt(
        {
            name: "name",
            type: "input",
            message: "What is this new department's name?"
        }
    ).then(function(answer){
        connection.query(`INSERT INTO department (name) VALUES ('${answer.name}')`, function(err){
            if(err) throw err;
            console.log("Department successfully created!");
            mainMenu();
        });
    });
    
}

function viewTable(){
    const query = "SELECT first_name, last_name, title, salary, name as department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id"
    connection.query(query, function(err,res){
        if(err) throw err;
        let table = cTable.getTable(res);
        console.log(table);
        mainMenu();
    });
}

function viewRoles(){
    connection.query("SELECT title, salary, name as department FROM role JOIN department ON role.department_id = department.id", function(err,res){
        if(err) throw err;
        let table = cTable.getTable(res);
        console.log(table);
        mainMenu();
    });
}

function viewDepartments(){
    connection.query("SELECT * FROM department", function(err,res){
        if(err) throw err;
        let table = cTable.getTable(res);
        console.log(table);
        mainMenu();
    });
}

function updateRole(){
    let employeeList = [];
    connection.query("SELECT first_name FROM employee", function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            employeeList.push(res[i].first_name);
        }
        testFunction(employeeList);
    });
}

function testFunction(employeeList){
    let roleList = [];
    connection.query("SELECT title FROM role", function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            roleList.push(res[i].title);
        }
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
            connection.query(`SELECT id FROM role WHERE title = '${answer.role}'`, function(err2,res2){
                if(err2) throw err2;
                const id = res2[0].id;
                connection.query(`UPDATE employee SET role_id = ${id} WHERE first_name = '${answer.name}'`, function(err2){
                    if(err2) throw err2;
                    console.log("Update successful!");
                    mainMenu();
                });
            });
        });
    });
}