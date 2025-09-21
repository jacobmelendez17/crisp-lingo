'use client';

import Image from 'next/image';
import {
	ClerkLoading,
	ClerkLoaded,
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton
} from '@clerk/nextjs';
import { Loader } from 'lucide-react'; //TODO: Change to custom loader
import { Button } from '@/components/ui/button';

export const Header = () => {
	return (
		<header className="flex h-28 justify-end bg-[#c0d1b7] px-6 py-4">
			<SignedOut>
				<div className="flex gap-3">
					<SignInButton mode="modal">
						<Button variant="ghost">Log In</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button variant="secondary">Sign Up</Button>
					</SignUpButton>
				</div>
			</SignedOut>
			<SignedIn>{/* You can optionally show a user menu here later */}</SignedIn>
		</header>
	);
};
