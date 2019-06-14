<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $table = 'authors';

    public function books()
    {
        return $this->hasMany('App\Book');
    }

    public function getBirthDateAttribute($value)
    {
        return $value ? (new \DateTime($value))->format('d M Y') : null;
    }

    public function getDeathDateAttribute($value)
    {
        return $value ? (new \DateTime($value))->format('d M Y') : null;
    }
}
