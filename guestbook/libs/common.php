<?php
 
define('APP_VERSION', '1.0');

if (!defined('APP_PATH')) define('APP_PATH', substr(dirname(__FILE__), 0, -4));

define('CONFIG_APP', APP_PATH . 'config/');	 
define('LIBS_PATH', APP_PATH . 'libs/');	 
define('CLASS_PATH', LIBS_PATH . 'Class/');	 
define('FUNCTION_PATH', LIBS_PATH . 'Function/');	 
define('CONTROLLER_PATH', APP_PATH . 'Controller/');	 

 
define('DEFAULT_MODULE_NAME', 'Index');
 
define('DEFAULT_ACTION_NAME', 'index');

 
header('Content-type:text/html; charset="utf-8"');

if ( version_compare(PHP_VERSION, '5.3.0', '<') ) {
	exit('PHP 版本太低了！！');
}

require(CONFIG_APP . 'config.php');

require(FUNCTION_PATH . 'common.php');

class App {

	static function run() {
		 
		define('MODULE_NAME', isset($_REQUEST['m']) && !empty($_REQUEST['m']) ? $_REQUEST['m'] : DEFAULT_MODULE_NAME);
		 
		define('ACTION_NAME', isset($_REQUEST['a']) && !empty($_REQUEST['a']) ? $_REQUEST['a'] : DEFAULT_ACTION_NAME);

		require_once(CLASS_PATH . 'Controller.class.php');

		 
		$class_name = $class_file_name = ucfirst(MODULE_NAME) . 'Controller';
		$class_file = CONTROLLER_PATH . $class_file_name . '.class.php';

		 
		if (!file_exists($class_file)) exit("控制器文件 $class_file 不存在!");

		require_once($class_file);
 
		if (!class_exists($class_name)) exit("控制器类 $class_name 不存在!");
		$Class = new $class_name;

		 
		$class_method = ACTION_NAME;
		if (!method_exists($Class, $class_method)) exit("控制器方法 $class_method 不存在!");
 
		call_user_func(array($Class, $class_method));
	}
}

App::run();
