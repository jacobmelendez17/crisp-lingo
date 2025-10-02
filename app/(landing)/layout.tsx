import { LandingHeader } from './landing-header';
import { Footer } from './footer';

type Props = {
	children: React.ReactNode;
};

const LandingLayout = ({ children }: Props) => {
	return (
		<div className="flex min-h-screen flex-col">
			<LandingHeader />
			<main className="flex flex-1 flex-col items-center justify-center">{children}</main>
			<Footer />
		</div>
	);
};

export default LandingLayout;
