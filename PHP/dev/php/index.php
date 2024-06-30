<!doctype html>
<html lang="en" class="page">
  @@include('partials/head.php')
  <body class="page__body">
    <div class="wrapper">
      <?php
      require_once("../vendor/autoload.php");
      ?>
      @@include('partials/header.php')
      <main class="main">
        <?php
        use app\Testing;
        $title = Testing::HelloWorld();
        ?>
      </main>
      @@include('partials/footer.php')
    </div>
  </body>
</html>
