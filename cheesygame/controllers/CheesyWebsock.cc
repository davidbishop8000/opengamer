#include "CheesyWebsock.h"

//extern std::unordered_map<std::string, unsigned> players;

struct Subscriber
{
    std::string chatRoomName_;
    drogon::SubscriberID id_;
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
        auto &s = wsConnPtr->getContextRef<Subscriber>();
        chatRooms_.publish(s.chatRoomName_, message);
    }
}

void CheesyWebsock::handleNewConnection(const HttpRequestPtr &req, const WebSocketConnectionPtr& wsConnPtr)
{
    // write your application logic here
	//std::cout << "opened" << std::endl;
	//wsConnPtr->send("haha!!!");
    Subscriber s;
    s.chatRoomName_ = "cheesy";//req->getParameter("room_name");
    s.id_ = chatRooms_.subscribe(s.chatRoomName_,
                                 [wsConnPtr](const std::string &topic,
                                        const std::string &message) {
                                     // Suppress unused variable warning
                                     (void)topic;
                                     wsConnPtr->send(message);
                                 });
    wsConnPtr->setContext(std::make_shared<Subscriber>(std::move(s)));
}

void CheesyWebsock::handleConnectionClosed(const WebSocketConnectionPtr& wsConnPtr)
{
    // write your application logic here
	//std::cout << "closed" << std::endl;
	auto &s = wsConnPtr->getContextRef<Subscriber>();
    chatRooms_.unsubscribe(s.chatRoomName_, s.id_);
}
