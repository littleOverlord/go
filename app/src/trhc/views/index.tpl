<!DOCTYPE html>

<html>
<head>
  <title>我的编程成长</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="shortcut icon" href="" type="image/x-icon" />
  <link rel="stylesheet" href="/static/css/common.css">
</head>

<body>
  <header class="top">
    <div class="warp">
      <h1 class="logo">泰瑞合成</h1>
      <ul class="nav">
        <li class="curr" data-nav="index">首页</li>
        <li data-nav="info">公司概况</li>
        <li data-nav="service">服务介绍</li>
        <li data-nav="advantage">核心优势</li>
        <li data-nav="join">加入我们</li>
        <li data-nav="cantact">联系我们</li>
      </ul>
    </div>
  </header>
  <div class="content" data-content="index">

  </div>
  <div class="content" data-content="info">

  </div>
  <div class="content" data-content="service">

  </div>
  <div class="content" data-content="advantage">

  </div>
  <div class="content" data-content="join">

  </div>
  <div class="content" data-content="cantact">

  </div>
  <footer class="footer">
    <div class="author">
      联系我: <a class="email" href="mailto:{{.Email}}">{{.Email}}</a>
    </div>
    <div><span class="copy_right">© 2017-2019 <a href="http://{{.Website}}">{{.Website}}</a> 版权所有</span><span>蜀ICP备17043385号-2</span></div>
  </footer>

  <script src="/static/js/jquery.3.3.1.js"></script>
</body>
</html>
