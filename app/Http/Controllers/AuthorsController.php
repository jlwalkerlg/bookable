<?php

namespace App\Http\Controllers;

use App\Author;

class AuthorsController extends Controller
{
    public function show(Author $author)
    {
        return $author->load('books');
    }
}
