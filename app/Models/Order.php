<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = [];

    // Relasi ke Membership
    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }

    // Relasi ke Order Details
    public function details()
    {
        return $this->hasMany(OrderDetail::class);
    }
}