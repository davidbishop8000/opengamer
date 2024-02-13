#include <drogon/drogon.h>
#include <chrono>
//std::unordered_map<std::string, unsigned> players;
using namespace drogon;
using namespace std::chrono_literals;

int main() {
	
	app().registerHandler(
        "/reg",
        [](const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback) {
            bool loggedIn =
                req->session()->getOptional<bool>("loggedIn").value_or(false);
            //HttpResponsePtr resp;
			HttpResponsePtr resp = HttpResponse::newHttpResponse();
            if (loggedIn == false)
			{
				resp->setBody("<p>login false</p>");
                //resp = HttpResponse::newHttpViewResponse("LoginPage");
			}
            else
			{
				resp->setBody("<p>login true</p>");
                //resp = HttpResponse::newHttpViewResponse("LogoutPage");
			}
            callback(resp);
        });
		
	app().registerHandler(
        "/logout",
        [](const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback) {
            HttpResponsePtr resp = HttpResponse::newHttpResponse();
            req->session()->erase("logged");
            resp->setBody("<script>window.location.href = \"/\";</script>");
            callback(resp);
        },
        {Post});

    app().registerHandler(
        "/login",
        [](const HttpRequestPtr &req,
           std::function<void(const HttpResponsePtr &)> &&callback) {
            HttpResponsePtr resp = HttpResponse::newHttpResponse();
            std::string name = req->getParameter("name");
            std::string color = req->getParameter("color");			
            if (name != "" && color != "")
            {
				if (color != "red" || color != "green" || color != "blue" || color != "yellow")
				{
					color = "black";
				}
				req->session()->insert("name", name);
				req->session()->insert("color", color);
                req->session()->insert("logged", true);
                //resp->setBody("<script>window.location.href = \"/game.html\";</script>");
				resp->setBody("{\"message\" : \"logged ok\"}");
                callback(resp);
            }
            else
            {
                //resp->setStatusCode(k401Unauthorized);
				//resp->setBody("<script>window.location.href = \"/game.html\";</script>");
                //resp->setBody("<script>window.location.href = \"/login.html\";</script>");
				resp->setBody("{\"message\" : \"not logged\"}");
                callback(resp);
				name = "monster";
				color = "black";
            }
			std::cout << name << std::endl;
			std::cout << color << std::endl;
			std::cout << "recv" << std::endl;
        },
        {Post});
	
	
    //Set HTTP listener address and port
    //drogon::app().addListener("0.0.0.0",80);
    //Load config file
    app().loadConfigFile("../config.json");
    //Run HTTP framework,the method will block in the internal event loop
	app().enableSession(1h);
    app().run();
    return 0;
}
