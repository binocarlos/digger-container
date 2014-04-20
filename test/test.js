var Container = require('../src');

var citydata = require('./fixtures/cities.json');
var simpledata = require('./fixtures/simple.json');

describe('container', function(){

  it('should create an empty container', function() {
    var container = Container();

    container.count().should.equal(0);
  })

  it('should be a function', function() {
    var container = Container();

    container.should.be.type('function');
  })

  it('should create an empty container with no models', function() {
    var container = Container();

    container.models.length.should.equal(0);
  })

  it('should emit events', function(done) {
    var test = Container();

    test.on('hello', done);
    test.emit('hello');
  })


  it('should build from basic data', function() {

    var test = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    test.count().should.equal(1);
    test.attr('price').should.equal(100);
    test.attr('address.postcode').should.equal('apples');
    test.tag().should.equal('product');

  })

  it('should not obliterate the tag if _digger data is given also', function() {

    var test = Container('product', {
      price:100,
      _digger:{
        id:'test'
      }
    })

    test.tag().should.equal('product');
  })


  it('should run the is() function and return the right result', function() {

    var test = Container('product', {
      price:100,
      _digger:{
        id:'test'
      }
    })

    test.is('product').should.equal(true);
    test.is('product2').should.equal(false);
  })

  it('should ensure a digger id', function() {
    var test = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    test.tag().should.equal('product');
    test.diggerid().should.be.type('string');
    test.diggerid().length.should.equal(32);
  })

  it('should have the correct underlying model structure', function() {

    var test = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    test.models[0].should.be.type('object');
    test.models[0].price.should.equal(100);
    test.models[0]._digger.should.be.type('object');

  })

  it('should clone another container and have changed the ids', function() {

    var test = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    var copy = test.clone();

    copy.attr('price').should.equal(100);
    copy.diggerid().should.not.equal(test.diggerid());
    

  })

  it('should allow the manipulation of the underlying data', function(){

    var test = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    test.addClass('apples');
    test.classnames().length.should.equal(1);
    test.hasClass('apples').should.equal(true);
    test.hasClass('oranges').should.equal(false);
    test.addClass('oranges');
    test.classnames().length.should.equal(2);
    test.hasClass('oranges').should.equal(true);
    test.removeClass('apples');

    test.classnames().length.should.equal(1);
    test.hasClass('apples').should.equal(false);

    test.id('hello');
    test.id().should.equal('hello');
    test.get(0)._digger.id.should.equal('hello');

    test.tag().should.equal('product');

    test.attr('some.deep.attr', 23);

    test.attr('some').should.be.type('object');
    test.attr('some.deep').should.be.type('object');
    test.attr('some.deep.attr').should.equal(23);

    var deep = test.attr('some.deep');
    deep.attr.should.be.type('number');
    deep.attr.should.equal(23);
  })  

  it('should allow access to diggerurl', function(){
    var test = Container('test');
    test.diggerid('123');
    test.path('/testapi');
    test.inode(34355);
    test.diggerurl().should.equal('/testapi/34355');
  })

  it('should export to JSON', function(){
    var test = Container(simpledata);

    test.toJSON().length.should.equal(1);
    test.toJSON()[0]._digger.should.be.type('object');
  })

  it('should be able to access single containers via eq', function(){
    var test = Container(citydata);

    test.count().should.equal(1);
    test.eq(0).should.be.type('function');
    test.eq(0).count().should.equal(1);
    test.eq(0).tag().should.equal('folder');

  })

  it('should be able to access single models via get', function(){
    var test = Container(citydata);

    test.count().should.equal(1);
    test.get(0).should.be.type('object');
    test.get(0)._digger.id.should.equal('places');

  })


  it('should change the attributes of all models', function(){

    var test = Container(citydata);

    test.children().attr('test', 23);


    test.children().eq(0).attr('test').should.equal(23);
    test.children().eq(1).attr('test').should.equal(23);
  })


  it('should allow arrays to be set as the value', function(){

    var test = Container('test');

    test.attr('arr', [1,2,3]);

    test.attr('arr')[1].should.equal(2);

  })

  it('should allow objects to be set as the value', function(){

    var test = Container('test');

    test.attr('obj', {
      fruit:'apple'
    })

    test.attr('obj').should.be.type('object');
    test.attr('obj.fruit').should.equal('apple');

  })

  it('should allow booleans to be set as the value', function(){

    var test = Container('test');

    test.attr('bool', false);

    test.attr('bool').should.be.type('boolean');
    test.attr('bool').should.equal(false);

  })

  it('should get the attribute for the first model', function(){

    var test = Container(citydata);

    var uk = test.children();
    var name = uk.attr('name');

    name.should.be.type('string');
    name.should.equal('UK');
  })

  it('should pass the supplychain down to children and descendents', function(){
    var test = Container(citydata);

    test.supplychain = 34;

    var children = test.children();
    var descendents = test.descendents();
    children.supplychain.should.equal(34);
    descendents.supplychain.should.equal(34);
  })

  it('should be able access children', function(){

    var test = Container(citydata);

    test.children().count().should.equal(2);
    test.children().eq(1).hasClass('big').should.equal(true);
  })

  it('should be able iterate models', function(){

    var test = Container(citydata);
    var childcounter = 0;
    test.children().each(function(container){
      childcounter++;
    })

    childcounter.should.equal(2);
  })

  it('should be able to map containers', function(){

    var test = Container(citydata);

    var values = test.children().map(function(container){
      return container.attr('name');
    })

    values.length.should.equal(2);
    values[0].should.equal('UK');
    values[1].should.equal('Scotland');
  })


  it('should ensure a digger property on all descendents', function() {

    var test = Container([{
      name:'test',
      _children:[{
        name:'child'
      }]
    }])

    var child = test.children().get(0);
    child._digger.diggerid.should.equal(test.children().eq(0).diggerid());
    
    
  })


  it('should inject data without overwriting existing values', function() {

    var container = Container([{
      _digger:{
        diggerid:10,
        tag:'folder'
      }
    }])

    container.inject_data({
      _digger:{
        diggerid:10
      },
      color:'red'
    })

    container.tag().should.equal('folder');
    container.attr('color').should.equal('red');
    
  })



  it('should add a container to an existing container', function() {

    var container1 = Container([{
      name:'num1'
    }])

    var container2 = Container([{
      name:'num2'
    }, {
      name:'num3'
    }])

    container1.add(container2);
    container1.count().should.equal(3);


  })

  it('should add an array of containers to an existing container', function() {

    var placeA = Container('_supplychain');
    placeA.path('/placeA');
    placeA.inode('10');
    var placeB = Container('_supplychain');
    placeB.path('/placeA');
    placeB.inode('11');
    var holder = Container();
    holder.add([placeA, placeB]);

    holder.models[0]._digger.inode.should.equal('10');
    holder.models[1]._digger.inode.should.equal('11');

  })



  it('should get the diggerurl', function() {

    var container1 = Container('test');
    container1.path('/a/b');
    container1.inode(10);
    container1.diggerurl().should.equal('/a/b/10');


  })



  it('should get the diggerurl for a supplychain', function() {

    var container1 = Container('_supplychain');
    container1.path('/a/b');
    container1.inode(10);
    container1.diggerurl().should.equal('/a/b');


  })

  



  it('should tell if it is a supplychain', function() {

    var container1 = Container('_supplychain');
    container1.isSupplyChain().should.equal(true);


  })

  it('should return the container after addClass', function() {

    var container1 = Container('apples');

    container1.addClass('red').hasClass('red').should.equal(true);
    


  })


  it('should replace the leading slash when setting the inode', function() {

    var container1 = Container('apples');

    container1.inode('/red')

    container1.inode().should.equal('red')


  })


/*

  it('should provide a summary', function() {

    var test = Container('product', {
      name:'test'
    }).addClass('thing').id('45')

    test.summary().should.equal('test: product#45.thing');
    
  })



  it('should append and find children', function() {
    var parent = Container('product', {
      price:100,
      address:{
        postcode:'apples'
      }
    })

    var child1 = Container('caption', {
      test:'hello1'
    }).addClass('apples')

    var child2 = Container('caption', {
      test:'hello2'
    }).addClass('oranges')

    parent.append([child1, child2]);

    parent.children().count().should.equal(2);
    parent.first().tag().should.equal('product');
    parent.find('.apples').tag().should.equal('caption');
    parent.find('.oranges').attr('test').should.equal('hello2');
  })

  it('should run selectors on local data', function() {

    var test = Container(citydata);

    test.find('city.south').count().should.equal(3);
    test.find('country[name^=U] > city.south area.poor').count().should.equal(3);

  })
  
  it('should apply limit and first and last modifiers', function() {
    var test = Container(citydata);
    test.find('city.south').count().should.equal(3);    
    test.find('city.south:first').count().should.equal(1);
    test.find('city.south:last').count().should.equal(1);
    test.find('city.south:limit(2)').count().should.equal(2);
  })



  it('should extract a meta skeleton', function() {

    var test = Container(citydata);

    var cities = test.find('city.south');

    var skeleton = cities.skeleton();

    skeleton.length.should.equal(3);
    skeleton[0].tag.should.equal('city');
    
  })
*/


})
