'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	[
		'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap',
		'rounded-md text-sm font-normal outline-none transition-all',
		'disabled:pointer-events-none disabled:opacity-50',
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
		'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring',
		'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
	].join(' '),
	{
		variants: {
			variant: {
				// keep shadcn defaults
				default:
					'bg-[var(--leaf)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--leaf)_85%,black)] focus-visible:ring-[var(--ring-ac)]',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary:
					'bg-[var(--sage)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--sage)_85%,black)]',
				locked: `
					relative text-gray-700 
					bg-gray-300 
					cursor-not-allowed 
					before:absolute before:inset-0 before:bg-[repeating-linear-gradient(135deg,#9ca3af_0px,#9ca3af_10px,#d1d5db_10px,#d1d5db_20px)]
					before:opacity-50 before:rounded-inherit before:pointer-events-none
				`,
				link: 'text-primary underline-offset-4 hover:underline',
				leaf: 'bg-[var(--leaf)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--leaf)_85%,black)]',
				mint: 'bg-[var(--mint)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--mint)_85%,black)]',
				sprout:
					'bg-[var(--sprout)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--sprout)_85%,black)]',
				custard:
					'bg-[var(--custard)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--custard)_85%,black)]',
				sand: 'bg-[var(--sand)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--sand)_85%,black)]',
				sage: 'bg-[var(--sage)] text-[var(--on-color)] hover:bg-[color-mix(in_oklab,var(--sage)_85%,black)]',

				black: 'bg-black text-white hover:bg-[rgb(20,20,20)]'
			},
			size: {
				sm: 'h-8 rounded-md gap-1.5 px-3 text-sm has-[>svg]:px-2.5',
				default: 'h-9 px-4 py-2 text-base has-[>svg]:px-3',
				lg: 'h-10 rounded-md px-6 text-lg has-[>svg]:px-4',
				xl: 'h-12 px-8 text-2xl has-[>svg]:px-6', // new
				icon: 'size-9'
			},
			rounded: {
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				'2xl': 'rounded-2xl'
			},
			pressable: {
				true: 'active:translate-y-[6%] active:scale-x-[1.03] active:scale-y-[0.92] transition-transform duration-75',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'default', // uses --leaf green
			size: 'default',
			rounded: 'md',
			pressable: true // feels nice for buttons
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
