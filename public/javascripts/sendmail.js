function sendMail(){
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;
    console.log('name:', name);
    console.log('email:', email);
    console.log('message:', message);
    $.ajax({
        type : "POST",
        url : "/email/contact",
        contentType: "application/json; charset=utf-8",
        async: true,
        data: JSON.stringify({
            "name": name,
            "email": email,
            "message": message
        }),
        traditional : true,
        success: function (res) {
            console.log(res);
            document.getElementById("myDiv").innerHTML = res.msg;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            document.getElementById("myDiv").innerHTML = res.msg;
        }
    });
}