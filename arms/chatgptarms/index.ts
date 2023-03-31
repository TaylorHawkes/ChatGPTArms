import React from 'react';
import usZips from 'us-zips';
import {WeatherArm} from '../weatherarm';
//import {EmailArm} from '../emailarm';

/*
  export const config = {
      runtime: "nodejs"
    }
    */

export class ChatGPTArms {
  

    public arms:any;
    
    constructor() {
     this.arms=[
         new WeatherArm(),
         //new EmailArm()
     ];
    }


    public async processConversation(convo) {
      for(let i = 0; i < this.arms.length; i++){
        const response = await this.arms[i].processConversation(convo);
        if(response){
            return response;
        }
      }
    
        return false
    }


     public async is_cos_sim_close(term,terms,cos_sim_threashold){
       const response = await fetch("https://www.grepper.com/api/cos_sim.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
        {
            term: term,
            terms:terms 
        }),
      });

      const data = await response.json();
      for(let i = 0; i < data.terms.length; i++){
          if(data.terms[i].cos_sim >cos_sim_threashold){
            return true;
          }
      }
      return false;
     }


}
