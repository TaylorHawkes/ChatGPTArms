import React from 'react';
import usZips from 'us-zips';
import {ChatGPTArms} from '../chatgptarms';

export class WeatherArm {

    public async processConversation(convo) {
        const step = await this.amINeeded(convo);
        if(step){
            if(step==1){
                return this.getZipCode(convo);
            }
            if(step==2){
                return this.checkWeatherOutside(convo);
            }
        }
        return false
    }


     public async amINeeded(convo){
         //if we just asked them for location
         let messages= convo.conversation;
         if(messages.length>1 && messages[messages.length - 2].hasOwnProperty('need_zip')){
             return 2;
         }
         const triggerTerms=[
             "weather",
             "what is the weather?",
             "current weather",
             "whats the temperature outside",
             "temp outside",
             "whats the weather",
             "whats the weather outside",
         ];

         let arms=new ChatGPTArms();
         if(await arms.is_cos_sim_close(convo.chatQuery,triggerTerms,.85)){
             return 1;
         }
        
         return false;
     }

     public async getZipCode(convo){
      let content="I'll check for you. What's your zip code?";
      //let content="I'll check for you. Where do you live?";
      return {
          "content":content,
          "need_zip":true,
          "role":"assistant"
      };
    }
  
     public async checkWeatherOutside(convo){

      const zipCode=convo.chatQuery;

    //if(!usZips.hasOwnProperty(zipCode)){
    //    return {
    //        "content":"Oops! I can't find this zip code";
    //    };
    //}
      const lat=usZips[zipCode].latitude;
      const lng=usZips[zipCode].longitude;

      const endpoint="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph";
            //endpoint+=";

      const response = await fetch(endpoint);
      const data = await response.json();

      let content="The current temperature out is "+data.current_weather.temperature+" °F, the windspeed is "+data.current_weather.windspeed+" mph";

      return {
          "content":content,
          "role":"assistant"
      };
    }

}
