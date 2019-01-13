  module.exports= {
    checkForWin: function (currentGame,row,col, playerId){  
        let start =col-3;
   let end=col+3;
   if(start<0){
     start=0;
   }
   if(end>=currentGame[0].length){
     end=currentGame[0].length-1;
   }
   let count=0;

   //vertical
   for(let j=col-1;j>=start;j--){
      if(currentGame[row][j]==playerId){
        count++;
      }else{
       break;
      }
     }
   for(let j=col+1;j<=end;j++){
      if(currentGame[row][j]==playerId){
        count++;
      }else{
        break;
      }
    }
    if(count>=3)return 1;
   
   count=0;
   if(row+3<currentGame.length){//Must be in 4th row from bottom (cannot win with height of 3)
     //horizontal
      for(let i=row+1;i<currentGame.length;i++){
        if(currentGame[i][col]==playerId){
          count++;
        }else{
          break;
        }
      }
      if(count>=3)return 1;

   }
   //diagonal 1
   
    count=0;
      for(let i=1;i<=3;i++){
        if((row+i >= currentGame.length) || (col-i < 0))break;
        if(currentGame[row+i][col-i]==playerId){
          count++;
        }else{
          break;
        }
      }
      for(let i=1;i<=3;i++){
        if((row-i < 0) || (col+i >= currentGame[0].length))break;
        if(currentGame[row-i][col+i]==playerId){
          count++;
        }else{
          break;
        }
      }
      if(count>=3)return 1;
    //Diagonal 2
      count=0;
      for(let i=1;i<=3;i++){
        if((row+i >=currentGame.length) || (col+i >= currentGame[0].length)){break;}
        if(currentGame[row+i][col+i]==playerId){
          count++;
        }else{
          break;
        }
      }
      for(let i=1;i<=3;i++){
        if((row-i < 0) || (col-i < 0)){break;}
         if(currentGame[row-i][col-i]==playerId){
           count++;
         }else{
           break;
         }    
      } 
    if(count>=3)return 1;
   return 0;

   
  },

    validateInput: function (currentGame,col){
        //check for bounds
        if(col>=currentGame[0].length || col< 0){
            return -1;
        }
        //get row-index
        for(let i=currentGame.length-1;i>=0;i--){
            if(currentGame[i][col]==0){
                return i;
            }
        }
        return -1;
    }
}