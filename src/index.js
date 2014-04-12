var utils = require('digger-utils');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var processmodel = require('./processmodel');
var XML = require('digger-xml');
var supermodels = require('supermodels');
var jdat = require('jdat');

module.exports = Container;

function Container(tag, data){
  return factory(tag, data);
}


util.inherits(Container, EventEmitter);

jdat({
  proto:Container.prototype,
  field:'models',
  childfield:'_children',
  spawn:function(models){
    models = models || [];
    var container = factory(models);
    if(this.supplychain){
      container.supplychain = this.supplychain;  
    }
    return container;
  }
})

function factory(){
  var models = [];

  if(typeof(arguments[0])==='string'){
    var string = arguments[0].replace(/^\s+/, '');
    var c = string.charAt(0);
    if(c==='{' || c==='['){
      var data = JSON.parse(string);
      if(c==='{'){
        data = [data];
      }
      models = data;
    }
    else if(c==='<'){
      models = XML.parse(string);
    }
    else{
      var model = arguments[1] || {};
      var digger = model._digger || {};
      digger.tag = string;
      model._digger = digger;
      models = [model];
    }
  }
  else if(Object.prototype.toString.call(arguments[0]) == '[object Array]'){  
    models = arguments[0];
  }
  else if(typeof arguments[0]==='object'){
    models = [arguments[0]];
  }

  if(models[0]===undefined || models[0]===null){
    models = [];
  }

  var instance = function container(){
    if(!instance.select){
      throw new Error('there is no select method attached to this container');
    }
    var args = [arguments[0]];
    if(arguments.length>1){
      args.push(arguments[1]);
    }
    return instance.select.apply(instance, args);
  }

  instance.__proto__ = Container.prototype;
  instance.build(models);
  
  return instance;
}

Container.factory = factory;



Container.prototype.build = function(models){
  var self = this;
  this.models = models || [];
  this.ensure_meta();
  return this;
}

Container.prototype.ensure_meta = function(){
  var self = this;
  var basepath = self.supplychain ? self.supplychain.path : null;
  this.models.forEach(function(model){
    processmodel(model, basepath);
  });
  return this;
}

Container.prototype.clone = function(){
  var data = JSON.parse(JSON.stringify(this.models));

  var ret = this.spawn(data);

  ret.recurse(function(des){
  	var model = des.get(0);
  	var digger = model._digger || {};
    delete(digger.inode);
    delete(digger.diggerid);
    delete(digger.path);
    delete(digger.created);
  	model._digger = digger;
  })

  ret.models.forEach(function(model){
    processmodel(model);
  })
  
  return ret;
}


Container.prototype.containers = Container.prototype.instances;

Container.prototype.add = function(container){
  var self = this;
  
  if(!container){
    return this;
  }
  
  if(util.isArray(container)){
    container.forEach(function(c){
      self.add(c);
    })
  }
  else{
    this.models = this.models.concat(container.models);
  }
  return this;
}

function get_models(){
  return this.models;
}

Container.prototype.attr = supermodels(get_models);
Container.prototype.digger = supermodels(get_models, '_digger');
Container.prototype.data = supermodels(get_models, '_data');

Container.prototype.id = supermodels(get_models, '_digger.id', true);
Container.prototype.tag = supermodels(get_models, '_digger.tag', true);
Container.prototype.classnames = supermodels(get_models, '_digger.class', true);
Container.prototype.diggerid = supermodels(get_models, '_digger.diggerid', true);
Container.prototype.path = supermodels(get_models, '_digger.path', true);
Container.prototype.inode = supermodels(get_models, '_digger.inode', true);

Container.prototype.diggerurl = function(){
  return this.path() + '/' + this.inode(); 
}

Container.prototype.removeAttr = supermodels(get_models, '', 'remove');
Container.prototype.removeDigger = supermodels(get_models, '_digger', 'remove');
Container.prototype.removeData = supermodels(get_models, '_data', 'remove');

Container.prototype.is = supermodels(get_models, '_digger.tag', 'is');
Container.prototype.addClass = supermodels(get_models, '_digger.class', 'array:add');
Container.prototype.removeClass = supermodels(get_models, '_digger.class', 'array:remove');
Container.prototype.hasClass = supermodels(get_models, '_digger.class', 'array:has');
Container.prototype.hasAttr = supermodels(get_models, '', 'has');

Container.prototype.isEmpty = function(){
  return this.count()===0;
}

Container.prototype.inject_data = function(data){
	this.models.forEach(function(model){
		utils.extend(true, model, data);
	})
  return this;
}

Container.prototype.toXML = function(){
  return XML.stringify(this.toJSON());
}

Container.prototype.add = function(toadd){
  var self = this;
  if(utils.isArray(toadd)){
    toadd.forEach(function(add){
      self.models = self.models.concat(add.models);
    })
  }
  else{
    this.models = this.models.concat(toadd.models);
  }
}