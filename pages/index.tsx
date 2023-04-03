import { useEffect, useState } from "react";
import styles from "./index.module.css";
import PermanentDrawerLeft from '../components/navbar';
import Head from "next/head";


export default function Home(): JSX.Element {
  const [chatQuery, setChatQuery] = useState("");
  const [messages,setMessages] = useState([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      //push the user message onto the convo
      let message = {role: 'user', content:chatQuery}
      messages.push(message)
      setMessages(JSON.parse(JSON.stringify(messages)));
      scrollToBottomWithSmoothScroll();

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
        {
            chatQuery: chatQuery,
            conversation:messages 
        }),
      });

      setChatQuery("");
      scrollToBottomWithSmoothScroll();

      const stream = response.body;
      const reader = stream.getReader();

      let result = '';
      const decoder = new TextDecoder();
      let firstResult=true;
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const raw_message= new TextDecoder().decode(value);
        const new_messages_json = JSON.parse('[' + raw_message.replace(/\}\{/g, '},{') + ']');
        for (let i = 0; i < new_messages_json.length; i++) {
            if(firstResult){
                messages.push(new_messages_json[i]);
                const newMessages = JSON.parse(JSON.stringify(messages))
                setMessages(newMessages);
                firstResult=false;
              }else{
                messages[messages.length-1].content+=new_messages_json[i].content;
                const newMessages = JSON.parse(JSON.stringify(messages))
                setMessages(newMessages);
            }
        }

        scrollToBottomWithSmoothScroll();

      }

      scrollToBottomWithSmoothScroll();
      
     //response.data.on('data', data => {
     //    console.log("cool");
     //    console.log(data);
     //});

 //   const data = await response.json();

 //   if (response.status !== 200) {
 //     throw data.error || new Error(`Request failed with status ${response.status}`);
 //   }
 //   messages.push(data.result);
 //   setAnimalInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      alert(error.message);
    }
  }

  useEffect(() => {
    const history = loadChatHistory()
    setMessages(history)
  }, [])

// without smooth-scroll
const scrollToBottom = () => {
  const theElement = document.getElementById('convo_ul');
  theElement.scrollTop = theElement.scrollHeight;
	//divRef.current.scrollTop = divRef.current.scrollHeight;
};

//with smooth-scroll
const scrollToBottomWithSmoothScroll = () => {
  const theElement = document.getElementById('convo_ul');
  theElement.scrollTo({
    top: theElement.scrollHeight,
    behavior: 'smooth',
  })
}

const loadChatHistory = () => {
  let history = localStorage.getItem('chat-history')
  if (!history) {
    localStorage.setItem('chat-history', JSON.stringify([]))
    history = localStorage.getItem('chat-history')
  }
  console.log(history)
  return JSON.parse(history)
}

//scrollToBottomWithSmoothScroll()


return (
    <>
      <Head>
        <title>ChatGPT Arms</title>
      </Head>
      <PermanentDrawerLeft />
      <main className={styles.main}>
        <ul className={styles.convo_ul} id="convo_ul">
            {messages.map((message) => (
              <li key={message.content}><div>{message.content}</div></li>
            ))}
        </ul>

        <form onSubmit={onSubmit} className={styles.search_form}>
          <input
            type="text"
            name="animal"
            placeholder="How can I help you?"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
          />
        </form>
      </main>
    </>
  );
}
