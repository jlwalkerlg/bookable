<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';

    protected $fillable = ['rating', 'review', 'book_id', 'user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
