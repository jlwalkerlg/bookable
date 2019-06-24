<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $table = 'quotes';

    public function book()
    {
        return $this->belongsTo('App\Book');
    }

    public function author()
    {
        return $this->belongsTo('App\Author');
    }
}
