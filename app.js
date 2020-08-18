var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
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
    console.log("ADDD EMMMPLOYEE");
    mainMenu();
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