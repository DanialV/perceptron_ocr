var alpha = 1.1;
var theta = 0.1;
var async = require('async');
var IO = require('./IO.js');
var NN = require('./Perceptorn.js');
async.waterfall([
    function(callback){
      IO.readTrain('EPR01-OCR/OCR_train.txt',function(err,data){
          if(err){
            callback(err,null);
          }
          else{
            callback(null,data);
          }
      });
    },
    function(data,callback){
      NN.Train(data,alpha,theta,function(err,Weights){
          if(err){
            callback(err,null);
          }
          else{
            Weights.push([alpha,theta]);
            callback(null,Weights);
          }
      });
    }
  ],function(err,weights){
  if(err){
    console.log("Problem in reading file");
  }
  else{
    IO._writeWeights('network_data/_weights.json',weights,function(err){
      if(err){
        console.log("Error I/O");
      }
      else{
        console.log("NN training has been completed successfully");
      }
    });
  }
});
