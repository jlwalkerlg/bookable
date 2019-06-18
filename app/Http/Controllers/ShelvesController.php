<?php

namespace App\Http\Controllers;

use App\User;

class ShelvesController extends Controller
{
    public function index(User $user)
    {
        return $user->shelves;
    }
}
