'use client';

import * as React from 'react';
import { Volume2, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
	src: string;
	label?: string;
	className?: string;
};

export function AudioPlayButton({ src, label = 'Play audio', className }: Props) {
	const audioRef = React.useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [isReady, setIsReady] = React.useState(false);
	const [hasError, setHasError] = React.useState(false);

	React.useEffect(() => {
		const audio = new Audio(src);
		audioRef.current = audio;

		const onCanPlay = () => setIsReady(true);
		const onEnded = () => setIsPlaying(false);
		const onPause = () => setIsPlaying(false);
		const onPlay = () => setIsPlaying(true);
		const onError = () => setHasError(true);

		audio.addEventListener('canplay', onCanPlay);
		audio.addEventListener('ended', onEnded);
		audio.addEventListener('pause', onPause);
		audio.addEventListener('play', onPlay);
		audio.addEventListener('error', onError);

		return () => {
			audio.pause();
			audio.removeEventListener('canplay', onCanPlay);
			audio.removeEventListener('ended', onEnded);
			audio.removeEventListener('pause', onPause);
			audio.removeEventListener('play', onPlay);
			audio.removeEventListener('error', onError);
			audioRef.current = null;
		};
	}, [src]);

	async function toggle() {
		const audio = audioRef.current;
		if (!audio || hasError) return;

		if (isPlaying) {
			audio.pause();
			return;
		}

		// restart if we previously finished
		if (audio.ended) audio.currentTime = 0;

		try {
			await audio.play();
		} catch {
			setHasError(true);
		}
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			rounded="2xl"
			pressable={false}
			onClick={toggle}
			disabled={hasError}
			aria-label={label}
			title={hasError ? 'Audio unavailable' : label}
			className={cn('h-10 w-10', className)}
		>
			{isPlaying ? <Pause className="size-4" /> : <Volume2 className="size-4" />}
			<span className="sr-only">{label}</span>
		</Button>
	);
}