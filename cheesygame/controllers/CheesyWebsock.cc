#include "CheesyWebsock.h"
#include <iostream>
#include <fstream>
#include <deque>

//extern std::unordered_map<std::string, unsigned> players;

std::deque<std::string> last_msg{"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""};

struct Subscriber
{
    std::string chatRoomName_;
    drogon::SubscriberID id_;
	std::string name_;
	std::string color_;
};

void CheesyWebsock::handleNewMessage(const WebSocketConnectionPtr& wsConnPtr, std::string &&message, const WebSocketMessageType &type)
{
    // write your application logic here
	//cheesy_count++;
	//wsConnPtr->send(std::to_string(cheesy_count));
	
	
	//Json::Value ret;
    //ret["message"] = "Hello, " + name;
    //auto resp = HttpResponse::newHttpJsonResponse(ret);
	
	//std::string
	
	if (type == WebSocketMessageType::Ping)
    {
        LOG_DEBUG << "recv a ping";
    }
	else if (type == WebSocketMessageType::Text)
    {
        
		//Json::Value ret = Json::Value(message);
		//std::string value = (ret)["name"].asString();		
		auto &s = wsConnPtr->getContextRef<Subscriber>();
		
		if (message.compare(0, 4, "msg_") == 0)
		{
			Json::Value ret;
			ret["type"] = "msg";
			ret["name"] = s.name_;
			ret["color"] = s.color_;
			ret["message"] = message.erase(0, 6);
			
			Json::StreamWriterBuilder builder;
			std::unique_ptr<Json::StreamWriter> writer( builder.newStreamWriter() );
			std::ostringstream os;
			writer->write(ret, &os);		
			std::string str = os.str();
			chatRooms_.publish(s.chatRoomName_, str);
			
			last_msg.pop_front();
			last_msg.push_back(str);			

			std::ofstream chat_log("chatlogs.log", std::ios::app);
			//chat_log.open("chatlogs.log");
			if (chat_log.is_open())
			{
				chat_log << s.name_ + ": " + message << std::endl;
			}
			chat_log.close();
		}
		else if (message.compare(0, 4, "move") == 0)
		{
			std::cout << "move" << std::endl;
		}
    }
}

void CheesyWebsock::handleNewConnection(const HttpRequestPtr &req, const WebSocketConnectionPtr& wsConnPtr)
{
    // write your application logic here
	//std::cout << "opened" << std::endl;
	//wsConnPtr->send("haha!!!");
	bool loggedIn = req->session()->getOptional<bool>("logged").value_or(false);
    Subscriber s;
	if (loggedIn == false)
	{
		s.chatRoomName_ = "trash";
		s.name_ = "not_loggined";
		s.color_ = "red";
    }
	else
	{
		s.chatRoomName_ = "cheesy";//req->getParameter("room_name");
		s.name_ = req->session()->get<std::string>("name");
		s.color_ = req->session()->get<std::string>("color");
	}
	
    s.id_ = chatRooms_.subscribe(s.chatRoomName_,
                                 [wsConnPtr](const std::string &topic,
                                        const std::string &message) {
                                     // Suppress unused variable warning
                                     (void)topic;
                                     wsConnPtr->send(message);
                                 });
    wsConnPtr->setContext(std::make_shared<Subscriber>(std::move(s)));
	for (std::string str : last_msg)
	{
		wsConnPtr->send(str);
	}
}

void CheesyWebsock::handleConnectionClosed(const WebSocketConnectionPtr& wsConnPtr)
{
    // write your application logic here
	//std::cout << "closed" << std::endl;
	auto &s = wsConnPtr->getContextRef<Subscriber>();
    chatRooms_.unsubscribe(s.chatRoomName_, s.id_);
}
