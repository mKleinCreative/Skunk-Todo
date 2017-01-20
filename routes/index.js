var express = require('express');
var router = express.Router();

var db = require('../config/database.js');

const formatLists = results => {
  const lists = results.reduce( (memo, result) => {
    if( ! memo.find( item => item.id === result.id ) ) {
      memo.push({
        id: result.id,
        // user_id: result.
        title: result.title,
        complete: result.complete,
        todos: []
      })
    }

    const index = memo.findIndex( item => item.id === result.id )

    if( result.list_id ) {
      memo[ index ].todos.push({
        todo_id: result.todo_id,
        description: result.description,
        complete: result.complete
      })
    }
    return memo
  }, [])
  console.log('lists',lists );
  return lists
}

router.get( '/', (request, response, next) => {
  response.render('index')
})

router.get( '/users/login', (request, response, next) => {
  db.getLists()
    .then( formatLists )
    .then( lists => response.render( 'landing', { lists }))
})

router.post('/makeList', (request, response) => {
  db.createList(request.body.title)
    .then( lists => {
      response.redirect( '/users/login' )
    })
    .catch( error => {
      response.render('error')
    })
});

router.post('/makeTodo', (request, response) => {
  const list_id = request.body.listIdForTodo
  const description = request.body.todoDesc
  const complete = false
  db.createTodo(list_id, description, complete)
    .then( list => {
      response.redirect( '/users/login' )
    })
    .catch( error => {
      console.log('error', error );

      response.render('error')
    })
});

// DELETE THE list

router.post('/deletelist/:id', (request, response) => {
  console.log('But did I delete?', request.params.id);
  db.removeList(request.params.id)
    .then( list => {
      response.redirect( '/users/login' )
    })
    .catch( error => {
      console.log('error', error );
      response.render('error')
    })
});

// DELETE single ToDo
router.post('/deletetodo/:todo_id', (request, response) => {
  console.log('But did I delete?', request.params.todo_id);
  db.removeTodo(request.params.todo_id)
    .then( list => {
      response.redirect( '/users/login' )
    })
    .catch( error => {
      console.log('error', error );
      response.render('error')
    })
});



module.exports = router;
