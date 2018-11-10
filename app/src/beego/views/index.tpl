<!DOCTYPE html>

<html>
<head>
  <title>我的生活日记</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="shortcut icon" href="" type="image/x-icon" />

  <style type="text/css">
    *,body {
      margin: 0px;
      padding: 0px;
    }

    body {
      margin: 0px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 20px;
      background-color: #fff;
    }

    header,
    footer {
      width: 960px;
      margin-left: auto;
      margin-right: auto;
    }

    .logo {
      background-image: url('');
      background-repeat: no-repeat;
      -webkit-background-size: 100px 100px;
      background-size: 100px 100px;
      background-position: center center;
      text-align: center;
      font-size: 42px;
      padding: 250px 0 70px;
      font-weight: normal;
      text-shadow: 0px 1px 2px #ddd;
    }

    header {
      padding: 100px 0;
    }

    footer {
      line-height: 1.8;
      text-align: center;
      padding: 50px 0;
      color: #999;
    }

    .description {
      text-align: center;
      font-size: 16px;
    }

    a {
      color: #444;
      text-decoration: none;
    }
    a:hover{
      text-decoration:underline;
    }

    .backdrop {
      position: absolute;
      width: 100%;
      height: 100%;
      box-shadow: inset 0px 0px 100px #ddd;
      z-index: -1;
      top: 0px;
      left: 0px;
    }
    .copy_right{
      margin-right:10px;
    }
  </style>
</head>

<body>
  <header>
    <h1 class="logo">欢迎来到我的生活日记</h1>
    <div class="description">
      每天都很有趣，每天都很快乐！
    </div>
  </header>
  <footer>
    <div class="author">
      联系我: <a class="email" href="mailto:{{.Email}}">{{.Email}}</a>
    </div>
    <div><span class="copy_right">© 2017-2019 <a href="http://{{.Website}}">{{.Website}}</a> 版权所有</span><span>蜀ICP备17043385号-1</span></div>
  </footer>
  <div class="backdrop"></div>

  <script src="/static/js/reload.min.js"></script>
</body>
</html>
