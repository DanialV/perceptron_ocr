var async = require('async');
var IO = require('./IO.js');
var NN = require('./Perceptorn.js');
async.waterfall([
    function(callback){
      IO.readWeights('network_data/_weights.json',function(err,weights){
          if(err){
            callback(err,null);
          }
          else{
            callback(null,weights);
          }
      });
    },
    function(weights,callback){
      IO.readTest('EPR01-OCR/OCR_test.txt',function(err,test_data){
          if(err){
            callback(err,null);
          }
          else{
            callback(null,test_data,weights);
          }
      });
    },
    function(test_data,weights,callback){
      NN.Test(test_data,weights,function(accuracy,save_output){
          callback(null,accuracy,weights,save_output);
      });
    }
  ],function(err,accuracy,data,save_output){
    if(err){
      console.log(err);
    }
    else{
      IO.writeWeights(accuracy,data[3][0],data[3][1],'perceptron_weights.txt‬‬',data,function(err){
        if(err){
          console.log("Error I/O");
        }
        else{
          console.log("Accurcy: " + accuracy + " Alpha: " + data[3][0] + " " + "Theta: "  + data[3][1]);
          console.log("NN testing has been completed successfully");
        }
      });
      IO.writeOutput('‫‪test_results.txt‬‬',save_output,function(err){
        if(err){
          console.log("Error I/O");
        }
      });
    }
});
