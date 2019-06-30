<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Stripe;
use Stripe\PaymentIntent;
use App\Transaction;

class CheckoutController extends Controller
{
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function confirm(Stripe $stripe)
    {
        $user = $this->request->user();
        try {
            if ($payment_method_id = $this->request->post('payment_method_id')) {
                $intent = $stripe->createIntent($payment_method_id, $user, $user->cart);
            } elseif ($payment_intent_id = $this->request->post('payment_intent_id')) {
                $intent = $stripe->confirmIntent($payment_intent_id);
            } else {
                return response(null, 400);
            }
            return $this->generatePaymentResponse($intent);
        } catch (\Stripe\Error\Base $e) {
            return ['error' => $e->getMessage()];
        }
        return response(null, 500);
    }

    private function generatePaymentResponse(PaymentIntent $intent)
    {
        if ($intent->status === 'requires_action' &&  $intent->next_action->type === 'use_stripe_sdk') {
            return ['requires_action' => true, 'payment_intent_client_secret' => $intent->client_secret];
        } elseif ($intent->status === 'succeeded') {
            $this->handleSuccess($intent);
            return ['success' => true];
        }
        return response(['error' => 'Invalid PaymentIntent status.'], 500);
    }

    private function handleSuccess(PaymentIntent $intent)
    {
        $user = $this->request->user();

        // Add intent id to user's old cart.
        $cart = $user->cart;
        $cart->addIntent($intent);

        // Give user new cart.
        $user->createNewCart();

        // Create new transaction.
        (new Transaction)->newFromIntent($intent);

        // Email user confirmation email.
    }
}
