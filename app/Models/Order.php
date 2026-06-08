<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $appends = ['whatsapp_number'];

    public function getWhatsappNumberAttribute()
    {
        // Ubah dari $this->nomor_telepon menjadi $this->phone_number
        $phone = $this->phone_number;

        if (str_starts_with($phone, '0')) {
            return '62' . substr($phone, 1);
        }
        if (str_starts_with($phone, '+62')) {
            return substr($phone, 1);
        }
        return $phone;
    }

    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }

    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }
}