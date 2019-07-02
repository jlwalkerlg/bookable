<h1>Confirmation of payment.</h1>

<p>Dear {{ $user->name }},</p>

<p>Your payment of £{{ $transaction->amount / 100 }} was accepted successfully on {{ $transaction->created_at }}.</p>

<p>Your order will be shipped to {{ $transaction->street_address }}, {{ $transaction->city }},
    {{ $transaction->postcode }}.</p>

<p>Your order:</p>

<ul>
    @foreach ($items as $item)
    <li>
        <p>{{ $item->book->title }} by {{ $item->book->author->name }}</p>
        <p>Price: £{{ $item->book->price }}</p>
        <p>Quantity: {{ $item->quantity }}</p>
    </li>
    @endforeach
</ul>
