'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	[
		// base
		'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap',
		'rounded-md text-sm font-medium outline-none transition-all',
		'disabled:pointer-events-none disabled:opacity-50',
		// keep shadcn svg helpers
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
		// focus & invalid states (shadcn defaults)
		'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring',
		'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
	].join(' '),
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline',

				// NEW: outline that reads your CSS variables (like your Svelte version)
				accentOutline:
					'border-2 bg-transparent text-[var(--accent-color,#4f46e5)] ' +
					'border-[var(--accent-color,#4f46e5)] ' +
					'hover:bg-[color-mix(in_oklab,var(--accent-color,#4f46e5)_12%,white)] ' +
					'dark:hover:bg-[color-mix(in_oklab,var(--accent-color,#4f46e5)_18%,black)]',

				// NEW: gradient with a subtle animated shine
				gradient:
					'relative text-white ' +
					'bg-[linear-gradient(135deg,#4f46e5,#06b6d4)] hover:shadow-lg ' +
					'before:absolute before:inset-0 before:rounded-inherit ' +
					'before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.25),transparent)] ' +
					'before:-translate-x-full before:animate-[shine_1.1s_ease-in-out] before:pointer-events-none'
			},
			size: {
				default: 'h-9 px-4 py-2 has-[>svg]:px-3',
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-9'
			},
			// NEW: quick corner control
			rounded: {
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				'2xl': 'rounded-2xl'
			},
			// NEW: opt-in press animation
			pressable: {
				true:
					// “squash” (down + slight x/y scale). Keep transforms small for accessibility.
					'active:translate-y-[6%] active:scale-x-[1.03] active:scale-y-[0.92] transition-transform duration-75',
				false: ''
			}
		},
		compoundVariants: [
			// keep the rounded prop consistent with size defaults
			{ size: 'sm', rounded: 'md', className: '' },
			{ size: 'default', rounded: 'md', className: '' },
			{ size: 'lg', rounded: 'md', className: '' }
		],
		defaultVariants: {
			variant: 'default',
			size: 'default',
			rounded: 'md',
			pressable: false
		}
	}
);

type ButtonProps = React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	};

function Button({
	className,
	variant,
	size,
	rounded,
	pressable,
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, rounded, pressable }), className)}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
