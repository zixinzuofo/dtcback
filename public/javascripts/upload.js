function showPic() {
    var f = document.getElementById("file");
    var file = f.files[0];
    var img = document.getElementById('image');
    var url = window.URL.createObjectURL(file);
    img.src = url;
    img.style.display = '';
}

function uploadAndSubmit() {
    var f = document.getElementById("file");
    if (f.files.length > 0) {
        // 寻找表单域中的 <input type="file" ... /> 标签
        var file = f.files[0];
        console.log(file);
        if (file.size > 1024*100) {
            alert('file should be less than 100KB');
            return
        }
        // try sending
        var reader = new FileReader();
        reader.onloadstart = function() {
            // 这个事件在读取开始时触发
            console.log("onloadstart");
            document.getElementById("bytesTotal").textContent = file.size;
        }
        reader.onprogress = function(data) {
            // 这个事件在读取进行中定时触发
            console.log("onprogress");
            document.getElementById("bytesRead").textContent = data.loaded;
        }
        reader.onload = function(data) {
            // 这个事件在读取成功结束后触发
            console.log("load complete");
            // var img = document.getElementById('image');
            // img.src = data.target.result;
        }
        reader.onloadend = function() {
            // 这个事件在读取结束后，无论成功或者失败都会触发
            if (reader.error) {
                console.log(reader.error);
            } else {
                console.log(file.name, file);
                document.getElementById("bytesRead").textContent = file.size;
                var formData = new FormData();
                console.log(file);
                formData.append('file', file);
                $.ajax({
                    type : "POST",
                    url : "/file/upload",
                    contentType: false,
                    async: true,
                    data: formData,
                    processData: false,
                    cache: false,
                    traditional : true,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    headers: {'Cache-Control': 'no-cache'}, // 这个很重要，不写的话有问题，具体还不是很了解为何
                    success: function (res) {
                        console.log(res);
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log(textStatus);
                    }
                });
            }
        }
        reader.readAsDataURL(file);
    } else {
        alert ("Please choose a file.");
    }
}