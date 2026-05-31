<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'membership_id',
        'type',
        'nominal',
        'saldo_akhir',
    ];

    // Relasi balik ke Member
    public function membership()
    {
        return $this->belongsTo(Membership::class);
    }
}