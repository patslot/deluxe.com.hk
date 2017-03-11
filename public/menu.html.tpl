<div class="nm_header">
  <div class="index-logo">
    <a class="logo" href="/">http://hk.add.nextmedia.com/</a>
  </div>
  <div vmenu="trigger">
    <img src="img/icon02.jpg">
  </div>
  <nav id="sticky-wrap">
    <div class="nav">
      <div class="nav--inner">
        <div class="nav--menu">
          <ul class="text">
            <li ng-repeat="c in categories">
              <a href="/{{::c.name}}" target="_self">{{::c.name}}</a>
            </li>
          </ul>
          <div class="search">
            <input type='text' placeholder='Search'>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>

<!-- style -->
<style>
  .nm_header {
    min-height: 60px;
  }
  
  @media all and (max-width: 768px) {
    [vmenu="trigger"] {
      position: absolute;
      top: 18px;
      display: inherit!important;
    }
    .nm_header .trigger_button {
      display: inherit!important;
    }
    .nm_header #sticky-wrap {
      display: none;
    }
    .nm_header .icons {
      display: none!important;
    }
  }
  
  [vmenu="trigger"] {
    display: none;
  }
  
  .nm_header .index-logo {
    display: inline-table;
    width: 100%;
  }
  
  .nm_header .index-logo .logo {
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    display: block;
    margin: 0 auto;
    width: 294px;
    height: 85px;
    background: url(/img/addlogo.png) no-repeat center;
  }
  
  .nm_header #sticky-wrap {
    z-index: 11;
    text-transform: uppercase;
    position: relative;
    width: auto;
    height: 65px;
    margin: 0 auto;
  }
  
  .nm_header .nav--inner {
    max-width: 1280px;
    margin: 0 auto;
    box-sizing: border-box;
    position: relative;
    height: auto;
  }
  
  .nm_header .nav--menu {
    display: block;
    position: relative;
    width: 100%;
    height: 55px;
    vertical-align: middle;
    text-align: center;
  }
  
  .nm_header .index-logo+#sticky-wrap .nav .nav--menu .text {
    padding-left: 0px;
  }
  
  .nm_header .nav--menu .text li {
    display: inline-block;
    margin: 0px 8px;
    font-size: 16px;
    font-weight: 300;
  }
  
  .nm_header .icons {
    display: inline-block;
    position: absolute;
    margin-top: 3px;
    top: 50%;
    right: 100px;
    background: #fff;
  }
  
  .nm_header .icons .facebook {
    background-image: url(img/sharefb.png);
    width: 25px;
    height: 25px;
    display: inline-block;
    background-size: 25px 25px;
  }
  
  .nm_header .icons .instagram {
    background-image: url(img/igicons.png);
    width: 25px;
    height: 25px;
    display: inline-block;
    background-size: 25px 25px;
  }
  
  .nm_header .nav--menu .search {
    display: inline-block;
    position: absolute;
    margin-top: -30px;
    top: 50%;
    right: 20px;
    background: #fff;
  }
</style>

<script type="text/javascript">
  $(document).ready(function() {
    $('[vmenu="trigger"]').on('click', function() {
      var $content = $('[vmenu="content"]').first();
      if ($content.hasClass('active')) {
        $content.animate({
          'left': '-300px'
        });
        $content.next().animate({
          'margin-left': '0',
          'margin-right': '0'
        });
        $content.removeClass('active');
      } else {
        $content.animate({
          'left': '0px'
        });
        $content.next().animate({
          'margin-left': '300px',
          'margin-right': '-300px'
        });
        $content.addClass('active');
      }
    });

    $(window).on('resize', function() {
      var $content = $('[vmenu="content"]').first();
      if ($content.hasClass('active')) {
        $content.animate({
          'left': '-300px'
        });
        $content.next().animate({
          'margin-left': '0',
          'margin-right': '0'
        });
        $content.removeClass('active');
      }
    });
  });
</script>