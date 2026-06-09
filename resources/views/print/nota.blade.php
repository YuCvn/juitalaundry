<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nota {{ $order->order_id }}</title>
    <style>
        body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #000;
            margin: 0;
            padding: 10px;
        }
        .ticket {
            width: 58mm; /* Standar printer thermal kecil (58mm) */
            max-width: 58mm;
            margin: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        .centered {
            text-align: center;
        }
        .right {
            text-align: right;
        }
        .bold {
            font-weight: bold;
        }
        .border-bottom {
            border-bottom: 1px dashed #000;
            padding-bottom: 5px;
            margin-bottom: 5px;
        }
        .mt-2 { margin-top: 10px; }
        .text-sm { font-size: 10px; }
    </style>
</head>
<body onload="window.print(); window.onafterprint = function(){ window.close(); }">
    <div class="ticket">
        <div class="centered border-bottom">
            <h2 style="margin: 0; font-size: 16px;">JUITA LAUNDRY</h2>
            <p style="margin: 3px 0; font-size: 10px;">Melayani Sepenuh Hati</p>
        </div>

        <div class="border-bottom mt-2 pb-2">
            <table class="text-sm">
                <tr><td>ID</td><td>: {{ $order->order_id }}</td></tr>
                <tr><td>Tgl</td><td>: {{ \Carbon\Carbon::parse($order->order_date)->format('d-m-Y H:i') }}</td></tr>
                <tr><td>Plg</td><td>: {{ $order->customer_name }}</td></tr>
                <tr><td>Metode</td><td>: {{ $order->pickup_method == 'delivery' ? 'Antar' : 'Ambil' }}</td></tr>
                <tr><td>Bayar</td><td>: {{ $order->payment_method == 'upfront' ? 'Di Awal' : 'Di Akhir' }}</td></tr>
            </table>
        </div>

        <div class="border-bottom mt-2">
            <table class="text-sm">
                @foreach($order->details as $detail)
                <tr>
                    <td colspan="2">{{ $detail->service->name ?? 'Layanan' }}</td>
                </tr>
                <tr>
                    <td>{{ $detail->qty }} x Rp {{ number_format($detail->price, 0, ',', '.') }}</td>
                    <td class="right">Rp {{ number_format($detail->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </table>
        </div>

        <div class="border-bottom mt-2">
            <table class="text-sm">
                <tr>
                    <td>Subtotal</td>
                    <td class="right">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</td>
                </tr>
                @if($order->delivery_fee > 0)
                <tr>
                    <td>Ongkir</td>
                    <td class="right">Rp {{ number_format($order->delivery_fee, 0, ',', '.') }}</td>
                </tr>
                @endif
                @if($order->discount > 0)
                <tr>
                    <td>Diskon Member</td>
                    <td class="right">- Rp {{ number_format($order->discount, 0, ',', '.') }}</td>
                </tr>
                @endif
                <tr class="bold" style="font-size: 12px;">
                    <td style="padding-top: 5px;">TOTAL</td>
                    <td class="right" style="padding-top: 5px;">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
                </tr>
            </table>
        </div>

        <div class="centered mt-2 text-sm">
            <p style="margin: 0;">Terima kasih atas kepercayaan</p>
            <p style="margin: 0;">Anda menggunakan jasa kami</p>
            <br>
            <p style="margin: 0;">--- {{ env('APP_NAME', 'Juita Laundry') }} ---</p>
        </div>
    </div>
</body>
</html>