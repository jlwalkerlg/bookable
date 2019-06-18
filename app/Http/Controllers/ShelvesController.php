<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShelvesController extends Controller
{
    public function index(Request $request)
    {
        $shelves = $request->user()->shelves();

        return $shelves->get();
    }
}
