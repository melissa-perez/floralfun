/*
    SETUP
*/

// Express

var express = require('express')
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
PORT = 3421

// Database
var db = require('./database/db-connector')

// Handlebars
const { engine } = require('express-handlebars')
var exphbs = require('express-handlebars') // Import express-handlebars
app.engine('.hbs', engine({ extname: '.hbs' })) // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs') // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
app.get('/', function (req, res) {
  // Declare Query 1
  let query1

  // If there is no query string, we just perform a basic SELECT
  if (req.query.name === undefined) {
    query1 = 'SELECT * FROM Suppliers;'
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM Suppliers WHERE name LIKE "${req.query.name}%"`
  }

  // Query 2 is the same in both cases
  //let query2 = "SELECT * FROM Suppliers;";

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    // Save the suppliers
    let suppliers = rows

    // Run the second query
    //db.pool.query(query2, (error, rows, fields) => {

    // Save the planets
    //let planets = rows;

    return res.render('index', { data: suppliers })
  })
  //})
})
// app.js

app.post('/add-supplier-form', function (req, res) {
  // Capture the incoming data and parse it back to a JS object
  let data = req.body

  // Capture NULL values
  //let email = parseInt(data['input-email']);
  //if (isNaN(email))
  //{
  //    email = 'NULL'
  //}

  //let is_local = parseInt(data['input-is_local']);
  //if (isNaN(is_local))
  //{
  //    is_local = 'NULL'
  //}

  // Create the query and run it on the database
  query1 = `INSERT INTO Suppliers (name, address, email, is_local) VALUES ('${data['input-name']}', '${data['input-address']}', '${data['input-email']}', '${data['input-is_local']}')`
  db.pool.query(query1, function (error, rows, fields) {
    // Check to see if there was an error
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error)
      res.sendStatus(400)
    }

    // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM Suppliers and
    // presents it on the screen
    else {
      res.redirect('/')
    }
  })
})

app.post('/update-supplier-form/', function (req, res) {
  let data = req.body
  //let supplierID = parseInt(data.id);
  //let deleteSuppliers = `DELETE FROM Suppliers WHERE pid = ?`;
  let updateSuppliers = `UPDATE Suppliers SET name = '${data['input-name']}' , address = '${data['input-address']}' , email = '${data['input-email']}', is_local = '${data['input-is_local']}' WHERE supplier_id = '${data['input-supplier_id']}'`
  // Run the second query
  db.pool.query(updateSuppliers, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/')
    }
  })
})

app.post('/delete-supplier-form/', function (req, res) {
  let data = req.body
  //let supplierID = parseInt(data.id);
  //let deleteSuppliers = `DELETE FROM Suppliers WHERE pid = ?`;
  let deleteSuppliers = `DELETE FROM Suppliers WHERE supplier_id = '${data['input-supplier_id']}'`
  // Run the second query
  db.pool.query(deleteSuppliers, function (error, rows, fields) {
    if (error) {
      console.log(error)
      res.sendStatus(400)
    } else {
      res.redirect('/')
    }
  })
})

/*
    LISTENER
*/
app.listen(PORT, function () {
  console.log(
    'Express started on http://localhost:' +
      PORT +
      '; press Ctrl-C to terminate.'
  )
})
