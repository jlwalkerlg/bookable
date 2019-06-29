<?php

namespace App\Services;

use Illuminate\Http\Request;
use App\Cart;

class Stripe
{
    public function __construct()
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function updateIntentOrNew(Cart $cart)
    {
        if (!$cart->intent_id) return $this->createIntent($cart);

        $intent = $this->retrieveIntent($cart->intent_id);

        if ($intent->status !== 'requires_payment_method') return $this->createIntent($cart);

        $amount = $cart->getAmount() * 100;

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

    public function createIntent(Cart $cart)
    {
        return \Stripe\PaymentIntent::create([
            'amount' => $cart->getAmount() * 100,
            'currency' => 'gbp',
            'payment_method_types' => ['card'],
            'metadata' => [
                'cart_id' => $cart->id,
                'user_id' => $cart->user_id
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
