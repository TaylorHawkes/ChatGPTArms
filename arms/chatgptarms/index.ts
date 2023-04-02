import React from 'react';
import usZips from 'us-zips';
import {WeatherArm} from '../weatherarm';
import {TdAmeritradeArm} from '../chatgptarmstdameritrade';
import { Configuration, OpenAIApi } from "openai";
import {EmailArm} from '../emailarm';

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
         new TdAmeritradeArm()
         //new EmailArm()
     ];
    }



    public async chatGPTParseToJson(parse_text) {

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
      const payload = {
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:parse_text}],
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 70,
        n: 1,
      };
       const bearer= "Bearer "+configuration.apiKey;
       const completion = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer,
        },
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json_result = await completion.json();
        try {
        const json= JSON.parse(json_result.choices[0].message.content);
        return json;
        } catch (error) {
            return false;
        }
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
