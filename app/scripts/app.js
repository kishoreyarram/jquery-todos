(function($, hbs) {

  var Utils = {
    _s4: function() {
      return Math.floor(Math.random() * 0x10000).toString(16); 
    },

    uuid: function() {
      return this._s4() + this._s4() + '-' + this._s4() + '-' + this._s4() + '-' + this._s4() + this._s4() + this._s4();
    },

    store: function(key, val) {
      if(arguments.length > 1) {
        return localStorage.setItem(key, JSON.stringify(val));
      } else {
        var store = localStorage.getItem(key);
        return (store && JSON.parse(store)) || [];
      }
    }
  };

  var App = {
    init: function() {
      this.todoTemplate = hbs.compile($('#todo-items').html());
      this.todos = Utils.store('todos');
     
      this.events();
      this.render();
    },


    events: function() {
      $('#todo-input').on('keyup', this.create.bind(this));
      $('#todo-list')
        .on('dblclick', '.view', this.edit.bind(this))
        .on('focusout', '.edit', this.update.bind(this))
        .on('keyup', '.edit', this.editKeyup.bind(this))
        .on('change', '.toggle', this.toggle.bind(this))
        .on('click', 'button', this.remove.bind(this));
    },


    create: function(e) {
      var $input = $(e.target);
      var val = $input.val().trim();
      if(e.which === 13 && val) {
        this.todos.push({
          id: Utils.uuid(),
          name: val,
          completed: false
        });

        $input.val("")
        $input.focus();

        this.render();
      }
    },

    edit: function(e) {
      var $input = $(e.target).closest('li').addClass('active').find('.edit');
      $input.val($input.val()).focus();
    },
  
    editKeyup: function(e) {
      var val = $(e.target).val();
      if(e.which !== 13) {
        return;
      } else {
        var idx = this._index(e.target);
        this.todos[idx].name = val;
      }

      this.render();
    },

    toggle: function(e) {
      var idx = this._index(e.target);
      this.todos[idx].completed = !this.todos[idx].completed;
      
      this.render();
    },

    update: function(e) {
      var val = $(e.target).val();

      if (!val) {
        this.destroy(e);
        return;
      }

      this.render();
    },

    remove: function(e) {
      var idx = this._index(e.target);
      this.todos.splice(idx, 1);
      this.render();
    },

    destroy: function(e) {
      var idx = this._index(e.target);
      this.todos.splice(idx, 1);

      this.render();
    },

    render: function() {
      var todos = this.todos;
      var todoTemplate = this.todoTemplate(todos);
      $('#todo-list').html(todoTemplate);
      $('#main').toggle(todos.length > 0);
      Utils.store('todos', todos);
    },

    _index: function(el) {
      var id = $(el).closest('li').data('id');
      var todos = this.todos;
      var i = todos.length;

      while(i--) {
        if(todos[i].id === id) {
          return i;
        }
      }
    }
  };

  App.init();

})(jQuery, Handlebars);
