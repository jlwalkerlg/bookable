<?php

namespace App\Http\Controllers;

use App\Author;

class AuthorsController extends Controller
{
    public function show($id)
    {
        return Author::where('id', $id)->with('books')->first();
    }
}
