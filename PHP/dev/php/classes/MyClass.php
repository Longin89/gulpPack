<?php
namespace app;

class MyClass implements MyIface {

    use MyTrait;
    public static function HelloClass() {
        echo "<h1 class=\"My__class\">Class check: <span>ok</span>;</h1>";
    }

    public function HelloIface() {
        echo "<h1 class=\"My__iface\">Iface check: <span>ok</span>;</h1>";
    }

}
?>
