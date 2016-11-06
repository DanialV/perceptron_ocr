var fs = require('fs');
module.exports = (function(){
  var _return = {};
  _return.readTrain = function(Address,callback){
    fs.readFile(Address, 'utf8', function(err, contents) {
      if(err){
        callback(err,null);
      }
      else{
        var input_data = contents.split('\n');
        var data = [];
        var NN1 = {};
        var NN2 = {};
        var NN3 = {};
        NN1.input = [];
        NN2.input = [];
        NN3.input = [];
        var weight = [];
        input_data.splice(input_data.length-1,1);
        for(x in input_data){
          input_data[x] = input_data[x].replace('\r','');
          var _NN1 = {};
          var _NN2 = {};
          var _NN3 = {};
          var input = input_data[x].split(" ").slice(0,64);
          var target = input_data[x].split(" ").slice(64,71);
          var map = {
            '1,0,0,0,0,0,0' : [-1,-1,-1],
            '0,1,0,0,0,0,0' : [-1,-1,1],
            '0,0,1,0,0,0,0' : [-1,1,-1],
            '0,0,0,1,0,0,0' : [-1,1,1],
            '0,0,0,0,1,0,0' : [1,-1,-1],
            '0,0,0,0,0,1,0' : [1,-1,1],
            '0,0,0,0,0,0,1' : [1,1,-1]
          }
          target = map[target.toString()];
          var NN_input = [];
          var NN_weight = [];
          input.forEach(function(bit){
            if(!isNaN(parseInt(bit))){
              if(parseInt(bit) == 0)bit = -1;
              NN_input.push(parseInt(bit));
              NN_weight.push(0);
            }
          });
          _NN1.input = NN_input;
          _NN2.input = NN_input;
          _NN3.input = NN_input;
          _NN1.target = target[0];
          _NN2.target = target[1];
          _NN3.target = target[2];
          NN1.input.push(_NN1);
          NN2.input.push(_NN2);
          NN3.input.push(_NN3);
          weight = NN_weight;
        }
        NN1.weight = weight.slice(0);
        NN2.weight = weight.slice(0);
        NN3.weight = weight.slice(0);
        data.push(NN1,NN2,NN3);
        callback(null,data);
      }
   });
  }
  _return.readTest = function(Address,callback){
    fs.readFile(Address, 'utf8', function(err, contents) {
      if(err){
        callback(err,null);
      }
      else{
        var input_data = contents.split('\n');
        var NN = [];
        var final_target = [];
        input_data.splice(input_data.length-1,1);
        for(x in input_data){
          input_data[x] = input_data[x].replace('\r','');
          var _NN = {};
          var input = input_data[x].split(" ").slice(0,64);
          var target = input_data[x].split(" ").slice(64,71);
          var map = {
            '1,0,0,0,0,0,0' : [-1,-1,-1],
            '0,1,0,0,0,0,0' : [-1,-1,1],
            '0,0,1,0,0,0,0' : [-1,1,-1],
            '0,0,0,1,0,0,0' : [-1,1,1],
            '0,0,0,0,1,0,0' : [1,-1,-1],
            '0,0,0,0,0,1,0' : [1,-1,1],
            '0,0,0,0,0,0,1' : [1,1,-1]
          }
          target = map[target.toString()];
          final_target.push(target);
          var NN_input = [];
          input.forEach(function(bit){
            if(!isNaN(parseInt(bit))){
              if(parseInt(bit) == 0)bit = -1;
              NN_input.push(parseInt(bit));
            }
          });
          _NN.input = NN_input;
          _NN.target= target;
          NN.push(_NN);
        }
        callback(null,NN);
      }
   });
  }
  _return.readWeights = function(Address,callback){
    var data;
    fs.readFile(Address, 'utf8', function (err, weights) {
      if (err) callback(err);
      else{
        data = JSON.parse(weights);
        callback(null,data);
      }
    });
  }
  _return.writeWeights = function(accurcy,alpha,theta,Address,Weights,callback){
    fs.writeFile(Address,'First Neural Weights: ' + Weights[0].join(' , ') + '\n' + 'Second Neural Weights: ' + Weights[1].join(' , ') + '\n'
    +'Third Neural Weights: '+ Weights[2].join(' , ') + '\n' + 'Accuracy: ' + accurcy + ' Alpha: '+ alpha + ' Theta: ' + theta + '\n\n',function(err){
      if(err){
        callback(err);
      }
      else {
        callback(null);
      }
    });
  }
  _return._writeWeights = function(Address,Weights,callback){
    fs.writeFile(Address, JSON.stringify(Weights),function(err){
      if(err){
        callback(err);
      }
      else {
        callback(null);
      }
    });
  }
  _return.writeOutput = function(Address,output,callback){
    fs.writeFile(Address, output,function(err){
      if(err){
        callback(err);
      }
      else {
        callback(null);
      }
    });
  }
  return _return;
})();
