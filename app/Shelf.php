<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class Shelf extends Model
{
    protected $table = 'shelves';

    protected $fillable = ['name', 'user_id'];

    public function items()
    {
        return $this->hasMany('App\ShelfItem');
    }
}
