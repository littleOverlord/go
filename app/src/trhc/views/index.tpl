<!DOCTYPE html>

<html>
<head>
  <title>我的编程成长</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="shortcut icon" href="" type="image/x-icon" />
</head>

<body>
  <header class="top">
    <h1 class="logo">欢迎来到我的编程世界</h1>
    <div class="description">
      每天我都在成长，希望大家跟我一起成长...
    </div>
  </header>
  <footer>
    <div class="author">
      联系我: <a class="email" href="mailto:{{.Email}}">{{.Email}}</a>
    </div>
    <div><span class="copy_right">© 2017-2019 <a href="http://{{.Website}}">{{.Website}}</a> 版权所有</span><span>蜀ICP备17043385号-2</span></div>
  </footer>
  <div class="backdrop"></div>

  <script src="/static/js/reload.min.js"></script>
</body>
</html>
