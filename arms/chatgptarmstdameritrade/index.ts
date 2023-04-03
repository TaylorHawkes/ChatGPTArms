import {ChatGPTArms} from '../chatgptarms';

export class TdAmeritradeArm {

  public async processConversation(convo: any) {
    return this.amINeeded(convo);
  }

  public async amINeeded(convo: any) {
    const chatQuery=convo.chatQuery;
    let parse_text_request=`parse the following sentence into json  of this structure
{
"user_intent":"unknown or news_search or stock_buy",
"company_name":"unkown or the companies name",
"company_ticker":"the companies stock ticker",
"buy_amount_shares":"unkown or the amount of shares the user wants to buy",
}
: ${convo.chatQuery}
`;

    parse_text_request = parse_text_request.replace(/(\r\n|\n|\r)/gm,"");//remove the new
    let cpa=new ChatGPTArms();
    let intent_json=await cpa.chatGPTParseToJson(parse_text_request);
    if(intent_json.user_intent =="news_search" && intent_json.company_ticker !="unknown"){
      return await this.getStockNews(convo,intent_json);
    }

    if(intent_json.user_intent =="stock_buy" && intent_json.company_ticker !="unknown" && intent_json.buy_amount_shares !="unkown" && intent_json.buy_amount_shares < 10){
      return await this.buyStock(convo,intent_json);
    }
      return false;
    }

    public async getStockNews(convo,intent_json){
      var url = 'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers='+intent_json.company_ticker+'&limit=10&apikey='+process.env.ALPHAVANTAGE_API_KEY;

      const news_r=await fetch(url);
      const news=await news_r.json();
      let content="";
      for (let i = 0; i < news.feed.length; i++) {
        content+="Title:"+news.feed[i].title+"\n";
        content+="Description:"+news.feed[i].summary+"\n";
        content+="URL:"+news.feed[i].url+"\n\n";
        if(i > 10)
          break;
      }

      return {
        "content":content,
        "role":"assistant"
      };
    }

    // we should verify everything with the user before we place a a buy
    public async buyStock(convo: any, intent_json: any){

    const ticker=intent_json.company_ticker;
    const amount=intent_json.buy_amount_shares;
    const url = 'https://api.tdameritrade.com/v1/accounts/'+process.env.TDAMERITRADE_ACCOUNT_ID+'/orders';

    const payload = {
      orderType: "MARKET",
      session: "NORMAL",
      duration: "DAY",
      orderStrategyType: "SINGLE",
      orderLegCollection: [
        {
          instruction: "Buy",
          quantity: amount,
          instrument: {
            symbol: ticker,
            assetType: "EQUITY"
          }
        }
      ]
    };
    
    const payloadS=JSON.stringify(payload);
    const bearer= 'Bearer '+process.env.TDAMERITRADE_ACCOUNT_TOKEN;
    const tdbuy = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Content-Length":payloadS.length.toString(),
        Authorization: bearer
      },
      method: "POST",
      body: payloadS,
    });
       
    const r= await tdbuy.text()
    console.log(r);
    const content="Ok, I just baught "+amount+" shares of "+ticker+"for you.";
    
    return {
      "content":content,
      "role":"assistant"
    };

  }
  

}
