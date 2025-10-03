import Image from 'next/image';
import {
	ClerkLoading,
	ClerkLoaded,
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton
} from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
	return (
		<header className="h-26 w-full border-b-2 bg-[#8ca795] px-4">
			<div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
				<div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
					<h1 className="tracking wide text-4xl font-extrabold text-neutral-600">Crisp Lingo</h1>
				</div>
				<ClerkLoading>
					<Loader className="text-muted-foreground h-5 animate-spin" />
				</ClerkLoading>
				<ClerkLoaded>
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton mode="modal">
							<Button size="xl" variant="custard">
								Login
							</Button>
						</SignInButton>
					</SignedOut>
				</ClerkLoaded>
			</div>
		</header>
	);
};
