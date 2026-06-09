<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class XssSanitization
{
    public function handle(Request $request, Closure $next)
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$input) {
            $input = is_string($input) ? strip_tags($input) : $input;
        });

        $request->merge($input);

        return $next($request);
    }
}