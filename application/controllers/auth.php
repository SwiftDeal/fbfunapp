<?php
/**
 * Description of auth
 *
 * @author Faizan Ayubi
 */
use Shared\Controller as Controller;
use Framework\RequestMethods as RequestMethods;
use Framework\Registry as Registry;
use \Curl\Curl;

class Auth extends Controller {
    
    protected function _register() {
        $user = new User(array(
            "name" => RequestMethods::post("name"),
            "email" => RequestMethods::post("email"),
            "password" => sha1(RequestMethods::post("password", rand(10000, 9999999))),
            "phone" => RequestMethods::post("phone", ""),
            "admin" => 0,
            "live" => 0
        ));
        $user->save();
    }

    public function fbLogin() {
        $this->JSONview();
        $view = $this->getActionView();
        $session = Registry::get("session");
        if ((RequestMethods::post("action") == "fbLogin") && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && ($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest')) {
            // process the registration
            $email = RequestMethods::post("email");
            $user = User::first(array("email = ?" => $email));
            if (!$user) {
                $this->_register();
            }
            $this->setUser($user);
            $view->set("success", true);
        } else {
            self::redirect("/home");
        }
    }

}