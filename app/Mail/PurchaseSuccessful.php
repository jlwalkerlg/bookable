<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Transaction;
use App\Cart;
use App\User;

class PurchaseSuccessful extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $transaction;
    public $items;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(User $user, Cart $cart, Transaction $transaction)
    {
        $this->user = $user;
        $this->transaction = $transaction;
        $this->items = $cart->items()->with('book.author')->get();
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('mail.purchase-successful');
    }
}
