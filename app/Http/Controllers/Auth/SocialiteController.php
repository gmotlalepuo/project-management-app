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
        try {
            $url = Socialite::driver($provider)->stateless()->redirect()->getTargetUrl();
            return response()->json(['url' => $url]);
        } catch (Exception $e) {
            \Log::error('Social login redirect error:', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to initialize ' . $provider . ' login'
            ], 500);
        }
    }

    public function callback($provider) {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();

            if (!$socialUser->getEmail()) {
                throw new Exception("No email provided from {$provider}. User data received: " . json_encode($socialUser));
            }

            // Get the name based on provider
            $name = match ($provider) {
                'github' => $socialUser->getNickname() ?: $socialUser->getName(),
                'google' => $socialUser->getName(),
                default => $socialUser->getName()
            };

            // Handle profile picture if available
            $profilePicture = null;
            if ($avatarUrl = $socialUser->getAvatar()) {
                $imageContents = @file_get_contents($avatarUrl);
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
                    'password' => bcrypt(Str::random(16))
                ]
            );

            Auth::login($user, true);

            return redirect()->intended(route('dashboard'));
        } catch (Exception $e) {
            \Log::error('Social login callback error:', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => [
                    'method' => request()->method(),
                    'url' => request()->fullUrl(),
                    'query' => request()->query(),
                    'body' => request()->all()
                ]
            ]);

            $errorMessage = 'Authentication failed. ';
            if (app()->environment('local', 'development')) {
                $errorMessage .= $e->getMessage();
            }

            return redirect()->route('login')
                ->withErrors(['error' => $errorMessage]);
        }
    }
}
