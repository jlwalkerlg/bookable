<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Stripe;
use App\Transaction;
use Illuminate\Support\Facades\DB;
use App\Cart;

class CheckoutController extends Controller
{
    public function begin(Request $request, Stripe $stripe)
    {
        $cart = $request->user()->cart;

        $intent = $stripe->updateIntentOrNew($cart);

        if ($intent->id !== $cart->intent_id) {
            $cart->intent_id = $intent->id;
            $cart->save();
        }

        return $intent->client_secret;
    }

    public function fulfill(Request $request, Stripe $stripe)
    {
        try {
            $event = $stripe->getEventFromWebhook($request);
        } catch (\UnexpectedValueException $e) {
            return response(null, 400);
        } catch (\Stripe\Error\SignatureVerification $e) {
            return response(null, 400);
        }

        $intent = $event->data->object;

        $transaction = new Transaction;

        DB::transaction(function () use ($intent, $transaction) {
            $transaction->createNewFromIntent($intent);
            Cart::create(['user_id' => $intent->metadata->user_id]);
        });
    }
}
