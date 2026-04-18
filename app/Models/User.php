<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'tb_admin';

    public $timestamps = false;

    protected $primaryKey = 'id_admin';

    protected $fillable = [
        'username',
        'password',
        'role', 
    ];

    protected $hidden = [
        'password',
    ];
}