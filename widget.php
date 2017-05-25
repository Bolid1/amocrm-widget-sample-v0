<?php

namespace Amo_sample_v0;

class Widget extends \Helpers\Widgets {
	protected function endpoint_check_password() {
		$login = \Helpers\Route::param('login');
		$password = \Helpers\Route::param('password');

		$result = 'success';
		if ($login === $password) {
			$result = 'failed';
		}

		echo json_encode(['status' => $result, 'hash' => [$this->build_hash($login, $password) => TRUE]]);
	}

	private function build_hash($login, $password) {
		return implode('_', [$login, $password]);
	}
}
