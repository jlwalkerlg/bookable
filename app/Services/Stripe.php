<?php

namespace App\Services;

use App\Cart;
use App\User;

class Stripe
{
    public function __construct()
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function confirmIntent(string $payment_intent_id)
    {
        return $this->retrieveIntent($payment_intent_id)->confirm();
    }

    private function retrieveIntent(string $payment_intent_id)
    {
        return \Stripe\PaymentIntent::retrieve($payment_intent_id);
    }

    public function createIntent(string $payment_method_id, User $user, Cart $cart, array $metadata = [])
    {
        return \Stripe\PaymentIntent::create([
            'payment_method' => $payment_method_id,
            'amount' => $cart->getAmount() * 100,
            'currency' => 'gbp',
            'confirmation_method' => 'manual',
            'confirm' => true,
            'metadata' => array_merge($metadata, [
                'cart_id' => $cart->id,
                'user_id' => $user->id,
            ])
        ]);
    }
}
