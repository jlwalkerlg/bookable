<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Stripe\PaymentIntent;
use DateTime;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = ['payment_intent_id', 'card_brand', 'card_last_four', 'amount', 'charged_at', 'street_address', 'city', 'postcode', 'user_id', 'cart_id'];

    public function getChargedAtAttribute($value)
    {
        return (new DateTime($value))->format('d M Y');
    }

    public function cart()
    {
        return $this->belongsTo('App\Cart');
    }

    public function newFromIntent(PaymentIntent $intent)
    {
        $this->payment_intent_id = $intent->id;
        $this->card_brand = $intent->charges->data[0]->payment_method_details->card->brand;
        $this->card_last_four = $intent->charges->data[0]->payment_method_details->card->last4;
        $this->amount = $intent->amount;
        $this->charged_at = date('Y-m-d, H:i:s', $intent->charges->data[0]->created);
        $this->street_address = $intent->metadata->street_address;
        $this->city = $intent->metadata->city;
        $this->postcode = $intent->metadata->postcode;
        $this->user_id = $intent->metadata->user_id;
        $this->cart_id = $intent->metadata->cart_id;
        return $this->save() ? $this : false;
    }
}
