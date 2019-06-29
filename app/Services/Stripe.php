<?php

namespace App\Services;

use Illuminate\Http\Request;

class Stripe
{
    public function __construct()
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function updateIntentOrNew(string $paymentIntentId, int $amount, int $userId)
    {
        $intent = $this->retrieveIntent($paymentIntentId);
        if ($intent->status !== 'requires_payment_method') return $this->createIntent($amount, $userId);
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

    public function retrieveIntent(string $paymentIntentId)
    {
        return \Stripe\PaymentIntent::retrieve($paymentIntentId);
    }

    public function createIntent(int $amount, int $userId)
    {
        return \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => 'gbp',
            'payment_method_types' => ['card'],
            'metadata' => [
                'user_id' => $userId
            ]
        ]);
    }

    public function getEventFromWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->server('HTTP_STRIPE_SIGNATURE');

        return \Stripe\Webhook::constructEvent(
            $payload,
            $sig_header,
            config('services.stripe.webhook.secret')
        );
    }
}
