<?php

namespace App\Http\Controllers\Auth;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller {
    public function redirect($provider) {
        $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    public function callback($provider) {
        try {
            $socialUser = Socialite::driver($provider)->user();

            // Get the name based on provider
            $name = match ($provider) {
                'github' => $socialUser->getNickname() ?: $socialUser->getName(),
                'google' => $socialUser->getName(),
                default => $socialUser->getName()
            };

            // Handle profile picture if available
            $profilePicture = null;
            if ($avatarUrl = $socialUser->getAvatar()) {
                $imageContents = file_get_contents($avatarUrl);
                if ($imageContents) {
                    $path = 'profile_pictures/' . Str::random(10);
                    $filename = Str::random(10) . '.jpg';
                    Storage::disk('public')->put($path . '/' . $filename, $imageContents);
                    $profilePicture = $path . '/' . $filename;
                }
            }

            $user = User::updateOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $name,
                    'email_verified_at' => now(),
                    'profile_picture' => $profilePicture ?? null,
                ]
            );

            Auth::login($user);

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (Exception $e) {
            return redirect()->route('login')
                ->withErrors(['error' => 'An error occurred during social login: ' . $e->getMessage()]);
        }
    }
}
