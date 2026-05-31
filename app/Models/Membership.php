<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_lengkap',
        'nomor_telepon',
        'alamat',
        'saldo',
    ];
    
    public function histories()
    {
        return $this->hasMany(MembershipHistory::class);
    }
}