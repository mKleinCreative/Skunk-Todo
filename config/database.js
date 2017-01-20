var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/skunk-todo';
var db = pgp(connectionString);

// add query functions

function getAllLists(request, response, next) {
  return db.many(' select * from list ')
}

function getAllTodos(request, response, next) {
  return db.many(
  `SELECT
	  *
   FROM
    list
   JOIN
    todo
   ON
    id = todo.list_id
    ORDER BY
    id asc`)
}

// Grabs a list name
function getListName(request, response ) {
  var listID = parseInt(request.params.id);
  return db.one(
  `SELECT
    name
   FROM
    list
   WHERE
    id = $1`, listID)
}

// Grabs a user name
function getUserName({ email, password }) {
  return db.one(
  `SELECT
    id
   FROM
    users
   WHERE
    email = $1
   AND
    password = $2`, [email, password])
}

function getUserById(id) {
  return db.one(
  `SELECT
    id
   FROM
    users
   WHERE
    id = $1`, [id])
}

// Grabs all the todos in a list
function getTodosInList(listID) {
  return db.many(
    `SELECT *
    FROM todo
    WHERE
    list_id = $1`, listID)
}

// Grabs all information from everything.
function getTodosFromList(request, response, next) {
  var todoId = parseInt(request.params.id);
  return db.one(
  `SELECT
    todo
   FROM
    list
   JOIN
    todo
   ON
    todo.list_id = id
   WHERE
    id=$1`, todoId)
}

// Creates a single todo
function createTodo(list_id, description, complete) {
  return db.one(
    `INSERT INTO
      todo ( list_id, description, complete )
     VALUES
      ( $1, $2, $3 )
     RETURNING list_id`, [ list_id, description, false ]
  )
}

// Creates a single list.
function createList( name ) {
  return db.one(
    `INSERT INTO
    list ( user_id, name, complete )
    VALUES
    ( $1, $2, $3 )
    RETURNING id`, [ user_id, name, false ]
  )
}

//creates a user
function createUser( email, password ) {
  console.log('email/pw',email, password );
  return db.one(
    `INSERT INTO
    users ( email, password )
    VALUES
    ( $1, $2 )
    RETURNING id`, [ email, password ]
  )
}

// Updates todos, yay
function updateTodo( description ) {
  return db.any(
  `UPDATE
    todo
   SET
    description=$2
   WHERE list_id=$1`, [ description ]
)}

// changes the complete value of the todo.
function completeTodo( id, complete) {
  return db.none(
  `UPDATE
    todo
   SET
    complete=$2
   WHERE id=$1`, [ id, complete ]
  )
}

// changes the complete value of the list.
function completeList( id, complete) {
  return db.none(
  `UPDATE
    list
   SET
    complete=$2
   WHERE id=$1`, [ id, complete ]
  )
}

// updates the title of the list.
function updateListTitle( id, title) {
  return db.none(
  `UPDATE
    list
   SET
    title=$2
   WHERE id=$1`, [ id, title ]
  )
}

// removes todo.
function removeTodo( todo_id ) {
  return db.none(
    `DELETE FROM
      todo
     WHERE
      todo_id=$1`, [todo_id]
  )
}

// removes list.
function removeList( id ) {
  return db.none(
    `DELETE FROM
      list
     WHERE
      id=$1`, [id]
  )
}

function getLists() {
  return db.any(
    "select * from list left outer join todo on list.id=todo.list_id order by list.id asc"
  )
}

module.exports = {
  getAllLists,
  getAllTodos,
  getListName,
  getUserName,
  getUserById,
  getLists,
  getTodosFromList,
  getTodosInList,
  createTodo,
  createUser,
  createList,
  updateTodo,
  completeTodo,
  completeList,
  updateListTitle,
  removeTodo,
  removeList
};
