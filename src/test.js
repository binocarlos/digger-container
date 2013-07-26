var Container = require('./index');

  var c = Container('product', {
    test:10
  });

  console.log('-------------------------------------------');
  console.dir(c.toJSON());

  console.log('-------------------------------------------');
  console.log('-------------------------------------------');
  console.dir(c.tag());
