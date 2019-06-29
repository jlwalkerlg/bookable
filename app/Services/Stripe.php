<?php

namespace App\Services;

class Stripe
{
    public function __construct()
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function updateIntentOrNew(string $paymentIntentId, int $amount)
    {
        $intent = $this->retrieveIntent($paymentIntentId);
        if ($intent->status !== 'requires_payment_method') return $this->createIntent($amount);
        if ($intent->amount === $amount) return $intent;
        return $this->updateIntent($intent, $amount);
    }

    private function updateIntent(\Stripe\PaymentIntent $intent, int $amount)
    {
        return \Stripe\PaymentIntent::update(
            $intent->id,
            ['amount' => $amount]
        );
    }

    private function retrieveIntent(string $paymentIntentId)
    {
        return \Stripe\PaymentIntent::retrieve($paymentIntentId);
    }

    public function createIntent(int $amount)
    {
        return \Stripe\PaymentIntent::create([
            "amount" => $amount,
            "currency" => "gbp",
            "payment_method_types" => ["card"],
        ]);
    }
}
