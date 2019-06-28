<?php

namespace App\Services;

class Stripe
{
    public function __construct()
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function retrieveIntentOrNew(string $paymentIntentId, int $amount)
    {
        $intent = $this->retrieveIntent($paymentIntentId);
        if ($intent->status === 'requires_payment_method') return $intent;
        return $this->createIntent($amount);
    }

    private function retrieveIntent(string $paymentIntentId)
    {
        return \Stripe\PaymentIntent::retrieve($paymentIntentId);
    }

    public function createIntent($amount)
    {
        return \Stripe\PaymentIntent::create([
            "amount" => $amount,
            "currency" => "gbp",
            "payment_method_types" => ["card"],
        ]);
    }
}
