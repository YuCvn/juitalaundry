<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    // 1. Kasih tahu Laravel nama tabelmu yang sebenarnya
    protected $table = 'tb_admin';

    // 2. Jika di tb_admin kamu TIDAK ADA kolom 'created_at' dan 'updated_at', matikan fiturnya:
    public $timestamps = false;

    protected $primaryKey = 'id_admin';

    // 3. Kolom apa saja yang boleh diisi
    protected $fillable = [
        'username',
        'password',
    ];

    // 4. Sembunyikan password
    protected $hidden = [
        'password',
    ];
}