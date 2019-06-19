<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Rating extends Model
{
    protected $table = 'ratings';

    protected $fillable = ['rating', 'book_id', 'user_id'];

    public function book()
    {
        return $this->belongsTo('App\Book');
    }
}
