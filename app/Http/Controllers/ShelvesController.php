<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShelvesController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->shelves;
    }
}
