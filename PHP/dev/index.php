<!doctype html>
<html lang="en" class="page">
  <?php 
  require_once __DIR__.'/php/partials/head.php';
  ?>
  <body class="page__body">
    <div class="wrapper">
    <?php 
  require_once __DIR__.'/php/partials/header.php';
  ?>
      <main class="main">
        <?php
        use app\MyClass;
        MyClass::HelloClass();
        MyClass::HelloTrait();
        $obj = new MyClass();
        $obj->HelloIface();
        ?>
      </main>
      <?php 
  require_once __DIR__.'/php/partials/footer.php';
  ?>
    </div>
  </body>
</html>