var Container = require('./index');

  var c = Container('product', {
    test:10
  });

  console.log('-------------------------------------------');
  console.dir(c.toJSON());