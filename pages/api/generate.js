import { Configuration, OpenAIApi } from "openai";
import { ChatGPTArms } from "../../arms/chatgptarms";
import { Readable } from 'stream';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const arms = new ChatGPTArms();

    export const config = {
      runtime: "edge"
    };


/*
    export default async function handler(req, res) {
    //export async function POST(req: Request): Promise<Response> {
      const data = "Hello world!\nThis is a stream of text.\n";
      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder();
          const chunk = encoder.encode(data);

          controller.enqueue(chunk);
          controller.close();
        }
      });

      const response = new Response(stream, {
        status: 200,
        statusText: "OK",
        headers: {
          "Content-Type": "text/plain"
        }
      });

      //res.setHeader("Content-Type", "text/plain");
      return response;
      //res.send(response);
    }
    */

 export default async function handler(req, res) {
   //await arms.cos_sim(term,terms);
// if (!configuration.apiKey) {
//   res.status(500).json({
//     error: {
//       message: "OpenAI API key not configured, please follow instructions in README.md",
//     }
//   });
//   return;
// }

const req_body= await req.json();
const chatQuery = req_body.chatQuery || '';
const conversation = req_body.conversation || [];
// if (chatQuery.trim().length === 0) {
//   res.status(400).json({
//     error: {
//       message: "Please enter a valid chat question",
//     }
//   });
//   return;
// }

  // try {
     
   const arms = new ChatGPTArms();
   const convo={
           chatQuery:chatQuery,
           conversation:conversation
   };


   const armMessage= await arms.processConversation(convo);
   if(armMessage){
        const stream = new ReadableStream({
        async start(controller) {
             const encoder = new TextEncoder();
             const queue = encoder.encode(JSON.stringify(armMessage));
             controller.enqueue(queue);
             controller.close();
        }
    });

       const response = new Response(stream, {
         status: 200,
         statusText: "OK",
         headers: {
           "Content-Type": "application/json",
         }
       });
       return response;
   }

/*
      const completion = await openai.createChatCompletion({
         model: "gpt-3.5-turbo",
         messages: [{role: "user", content:"hey how are you"}],
         stream: true
      },{ responseType: 'stream' });
      */
      let gpt_messages=[];
      for(let i=0;i<conversation.length;i++){
          gpt_messages.push({
              role:conversation[i].role,
              content:conversation[i].content
          })
      }
      //push the last chat query on the 
   ///  gpt_messages.push({
   ///        role:"user",
   ///        content:chatQuery
   ///  })


      const payload = {
        model: "gpt-3.5-turbo",
        messages: gpt_messages,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1000,
        stream: true,
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



    let counter = 0;
    const stream = new ReadableStream({
        async start(controller) {
             const encoder = new TextEncoder();
             const decoder = new TextDecoder();
              function onParse(event ) {
                    if (event.type === "event") {
                      const data = event.data;
                      if (data === "[DONE]") {
                        controller.close();
                        return;
                      }
                      try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta?.content || "";
                        if (counter < 2 && (text.match(/\n/) || []).length) {
                          return;
                        }
                        const new_message={
                            "content":text,
                            "role":"assistant"
                        };
                        const queue = encoder.encode(JSON.stringify(new_message));
                        controller.enqueue(queue);
                        counter++;
                      } catch (e) {
                        controller.error(e);
                      }
                    }
              }
              const parser = createParser(onParse);
              for await (const chunk of completion.body){
                   parser.feed(decoder.decode(chunk));
              }
        }
    });


       //res.setHeader("Content-Type", "text/plain");

       // const response = new Response({
       const response = new Response(stream, {
         status: 200,
         statusText: "OK",
         headers: {
           "Content-Type": "text/plain"
         }
       });
       return response;
       //res.send(response);
       //res.send(response);
       //return response;
     //res.status(200).json({ result: completion.data.choices[0].message });

 //} catch(error) {
 //  // Consider adjusting the error handling logic for your use case
 //  if (error.response) {
 //    console.error(error.response.status, error.response.data);
 //    res.status(error.response.status).json(error.response.data);
 //  } else {
 //    console.error(`Error with OpenAI API request: ${error.message}`);
 //    res.status(500).json({
 //      error: {
 //        message: 'An error occurred during your request.',
 //      }
 //    });
 //  }
 //}

 }

