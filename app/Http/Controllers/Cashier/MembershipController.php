<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        return Inertia::render('Cashier/Membership');
    }
}