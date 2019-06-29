<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Stripe;
use App\Transaction;

class CheckoutController extends Controller
{
    public function begin(Request $request, Stripe $stripe)
    {
        $user = $request->user();
        $cart = $user->cart;
        $amount = $cart->getAmount() * 100;
        $intent = $cart->intent_id ? $stripe->updateIntentOrNew($cart->intent_id, $amount, $user->id) : $stripe->createIntent($amount, $user->id);
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
        if (!$transaction->createNewFromIntent($intent)) return response('Failed to create transaction.', 500);
    }
}
