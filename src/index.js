/*

  (The MIT License)

  Copyright (C) 2005-2013 Kai Davenport

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var Proto = require('./proto');

module.exports = factory;


/*

	Factory
	
*/
function factory(){
	/*
  
    first let's extract the model data
    
  */

  console.dir(arguments);
  console.dir(typeof(arguments[0]));
  var models = [];

  if(typeof(arguments[0])==='string'){
    console.log('-------------------------------------------');
    console.log('string');
    var model = arguments[1] || {};
    var digger = model._digger || {};
    digger.tag = arguments[0];
    model._digger = digger;
    models = [model];
  }
  else if(typeof arguments[0]==='array'){
    models = arguments[0];
  }
  else if(typeof arguments[0]==='object'){
    models = [arguments[0]];
  }
  
  /*
  
    now make the actual container which is a function that triggers it's own 'select' method
    (for JQuery style selects like):

      container('some.selector')

    which is the same as

      container.select('some.selector')
    
  */
  var instance = function container(){
    if(!instance.supplychain){
      throw new Error('there is no supply chain attached to this container');
    }
    return instance.supplychain.select.apply(instance, _.toArray(arguments));
  }

  instance.__proto__ = new Proto;
  instance.build(models);
  
  return instance;
}