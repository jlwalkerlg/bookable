<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Stripe;

class CheckoutController extends Controller
{
    public function begin(Request $request, Stripe $stripe)
    {
        $cart = $request->user()->cart;
        $amount = $cart->getAmount() * 100;
        $intent = $cart->intent_id ? $stripe->updateIntentOrNew($cart->intent_id, $amount) : $stripe->createIntent($amount);
        if ($intent->id !== $cart->intent_id) {
            $cart->intent_id = $intent->id;
            $cart->save();
        }
        return $intent->client_secret;
    }
}
