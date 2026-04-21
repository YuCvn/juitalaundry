<?php

namespace App\Http\Controllers\Cashier;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Cashier/History');
    }
}