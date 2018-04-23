function ajax(method, url, data, success) {
  var xhr = null;
  try {
    xhr = new XMLHttpRequest();
  } catch (e) {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
   if (method == "get" &&data) {
      url += "?" + data;
    }

  xhr.open(method, url, true);

  if (method == "post") {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
  }else{
    xhr.send();
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        success && success(xhr.responseText);
      } else {
        document.body.innerHTML ="<h1>" + xhr.status + "</h1><h2>你要找的页面不存在!</h2>";
      }
    }
  };
}
