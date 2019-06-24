<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserQuote extends Model
{
    protected $table = 'user_quote';

    protected $fillable = ['user_id', 'quote_id'];

    public function quote()
    {
        return $this->belongsTo('App\Quote');
    }
}
