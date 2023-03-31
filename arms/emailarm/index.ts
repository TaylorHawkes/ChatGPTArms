import React from 'react';
import usZips from 'us-zips';
import {ChatGPTArms} from '../chatgptarms';
import {nodemailer} from 'nodemailer';

export class EmailArm {

    public async processConversation(convo) {
        console.log("processing email");
        const step = await this.amINeeded(convo);
        if(step){
            if(step==1){
                return this.sendEmail(convo);
            }
        }
        return false
    }


     public async amINeeded(convo){
         const triggerTerms=[
             "send it to taylordhawkes@gmail.com",
         ];

         let arms=new ChatGPTArms();
         if(await arms.is_cos_sim_close(convo.chatQuery,triggerTerms,.85)){
             return 1;
         }
        
         return false;
     }

  
     public async sendEmail(convo){

     let messages= convo.conversation;
     let emailText=messages[messages.length-2].content;

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '<test@example.com>', 
    to: "test@example.com",
    subject: "Hello",  
    text: emailText
  });

      return {
          "content":"Cool, I sent your email",
          "role":"assistant"
      };

    }

}
