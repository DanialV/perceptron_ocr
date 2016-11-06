var async = require("async");
module.exports = (function(){
  var _return = {};
  trainANural = function (data,theta,alpha,callback){
      var finished = false;
      var cntr2 = 0;
      while(!finished){
        var cntr = 0;
        for(x in data.input){
          var y_in = 0;
          var y;
          for(i in data.input[x].input){
              y_in += data.input[x].input[i] * data.weight[i];
          }
          y = (y_in > theta) ? 1 : (-theta <= y_in && y_in <= theta )? 0 : (y_in < -theta)?-1 : "Never Should Happen";
          if(y != data.input[x].target){
            for(i in data.weight){
                data.weight[i] = data.weight[i]  + alpha * data.input[x].target * data.input[x].input[i];
            }
          }
          else{
            cntr++;
          }
        }
        if(cntr == data.input.length){
          finished = true;
        }
        cntr2++;

      }
      callback(data.weight);
  }
  testANural =  function (weight,input,teta,callback){
      var result = 0;
      for(i in weight){
          result+= weight[i] * input[i];
      }
      var y = (result > teta) ? 1 : (-teta <= result && result <= teta )? 0 : (result < -teta)?-1 : "Never Should Happen";
      callback(y);
  }
  _return.Train = function(data,alpha,theta,callback){
    async.parallel([
      function(callback){
        data[0].weight.fill(0);
        trainANural(data[0],theta,alpha,function(weight){
              callback(null,weight);
        });
      },
      function(callback){
        data[1].weight.fill(0);
        trainANural(data[1],theta,alpha,function(weight){
              callback(null,weight);
        });
      },
      function(callback){
        data[2].weight.fill(0);
        trainANural(data[2],theta,alpha,function(weight){
              callback(null,weight);
        });
      },
    ],function(err,NN_Weight){
        if(err){
          callback(err,null);
        }
        else {
          callback(null,NN_Weight);
        }
    });
  }
  _return.Test = function(test_data,NN_Weight,callback){
    var alpha = NN_Weight[3][0];
    var theta = NN_Weight[3][1];
    var accurcy = 0;
    var iterator = 0;
    var trueCheck = 0;
    var save_output = "";
    async.each(test_data,function(inputPerTest,next){
      async.parallel([
        function(callback){
          testANural(NN_Weight[0],inputPerTest.input,theta,function(result){
              callback(null,result);
          });
        },
        function(callback){
          testANural(NN_Weight[1],inputPerTest.input,theta,function(result){
              callback(null,result);
          });
        },
        function(callback){
          testANural(NN_Weight[2],inputPerTest.input,theta,function(result){
              callback(null,result);
          });
        }
      ],function(err,result){
        save_output = save_output.concat('NN Output: [' + result.toString() + ']' + "-->" + 'True Output [' + inputPerTest.target.toString() +']' + "\n");
         if(result.toString() == inputPerTest.target.toString()){
           trueCheck++;
         }
         iterator++;
         next();
      });
    },function(){
      accurcy  = (trueCheck / iterator )* 100;
      callback(accurcy,save_output);
    });
  }
  return _return;
})();
