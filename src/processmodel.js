var utils = require('digger-utils');

function process_model(model, parentpath){
  if(!model._digger){
    model._digger = {};
  }
  if(!model._data){
    model._data = {};
  }
  if(!model._digger.inode){
    model._digger.inode = utils.littleid();
  }
  if(!model._digger.diggerid){
    model._digger.diggerid = utils.diggerid();
  }
  if(!model._digger.path){
    model._digger.path = parentpath;
  }
  if(!model._digger.created){
    model._digger.created = new Date().getTime();
  }
  if(model._children){
    var parentwarehouse = model._digger.diggerwarehouse;
    model._children.forEach(function(model){
      process_model(model, parentpath ? parentpath + '/' + model._digger.inode : null);
    });
  }
}

module.exports = process_model;