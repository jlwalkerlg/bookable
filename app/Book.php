<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'books';

    protected $casts = [
        'price' => 'float'
    ];

    public function getPublicationDateAttribute($value)
    {
        return date('d M Y', jdtounix($value));
    }

    public function author()
    {
        return $this->belongsTo('App\Author');
    }
}
