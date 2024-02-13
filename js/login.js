let user_color = "";
function wrong_name() {
  let username = document.getElementById('username').value;
  let wrong = document.getElementById('wrong');
  if (username != "" && user_color != "") {
    console.log(`sender?name=${username}&color=${user_color}`);
    playerLogin(username, user_color);
    //window.location.replace(`game.html?name=${username}&color=${user_color}`);
  } else if (username != "") {
    wrong.innerHTML = "Choose any color!";
  } else {
    wrong.innerHTML = "Enter your name!";
  }
}

function setColor(color) {
  const param = '4px solid rgb(41, 41, 41)';
  document.getElementById('red').style.border = param;
  document.getElementById('green').style.border = param;
  document.getElementById('blue').style.border = param;
  document.getElementById('yellow').style.border = param;
  document.getElementById(color).style.border = '4px solid white';
  user_color = color;
  console.log(color);
}

async function playerLogin(uname, ucolor) {
    try {
        var params = new URLSearchParams('name=' + uname + '&color=' + ucolor);
        const response = await fetch(`login`, {
            method: 'POST',
            /*headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },*/
            body: params
        });
        if (response.ok) {
            const data = await response.json();
            if ('message' in data) {
                //const e_stat = document.getElementById("e_stat");
                //e_stat.innerHTML = data.message;
                //if (data.message == "Успешно") e_stat.style.color = "green";
                //else e_stat.style.color = "red";}
                console.log(data.message);
                console.log(`fetch?name=${uname}&color=${ucolor}`);
            }
        }
    } catch (e) {
        //console.log(e);
    }
}