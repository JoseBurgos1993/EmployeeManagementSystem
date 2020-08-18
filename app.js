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
    let employeeList = [];
    const query = "SELECT first_name FROM employee";
    connection.query(query, function(err,res){
        if(err) throw err;
        for(let i = 0; i < res.length; i++){
            employeeList.push(res[i].first_name);
        }
        testFunction(employeeList);
    });

    
}
function testFunction(employeeList){
    inquirer.prompt({
        name: "name",
        type: "list",
        message: "Select an employee by their first name:",
        choices: employeeList
    }).then(function(answer){
        console.log(answer.name);

        connection.query("SELECT * FROM employee", function(err,res){
            if(err) throw err;
            console.log("\n\n");
            console.table(res);
        });

        mainMenu();
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
    console.log("UPDERROLE");
    mainMenu();
}