import Image from 'next/image';
/*import { 
    ClerkLoading,
    ClerkLoaded,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton
} from "@clerk/nextjs;*/
import { Loader } from 'lucide-react'; //TODO: Change to custom loader
import { Button } from '@/components/ui/button';

export const Header = () => {
	<header className="h-20 w-full border-b-2 border-slate-200 px-4">
		<div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
			<div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
				<Image src="/mascot.svg" height={40} width={40} alt="Mascot" />
				<h1 className="tracking wide text-2xl font-extrabold text-green-600">Crisp Lingo</h1>
			</div>
			{/*<ClerkLoading>
					<Loader className="text-muted-foreground h-5 animate-spin" />
				</ClerkLoading>
				<ClerkLoaded>
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton mode="modal">
							<Button size="lg" variant="ghost">
								Login
							</Button>
						</SignInButton>
					</SignedOut>
				</ClerkLoaded>*/}
		</div>
	</header>;
};
