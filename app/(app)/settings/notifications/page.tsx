'use client';

import { useState } from 'react';

type Channel = 'email' | 'sms' | 'both';

export default function NotificationsSettingsPage() {
	const [channel, setChannel] = useState<Channel>('email');
	const [newsUpdates, setNewsUpdates] = useState(true);
	const [progressUpdates, setProgressUpdates] = useState(true);
	const [inactivityAlerts, setInactivityAlerts] = useState(false);
	const [trialAlerts, setTrialAlerts] = useState(true);

	return (
		<div className="space-y-10">
			<header>
				<h1 className="text-4xl font-bold text-neutral-900">Notifications</h1>
			</header>

			{/* CHANNEL PREFERENCE */}
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Notification channel</h2>

				<div className="mt-4 grid gap-6 md:grid-cols-3">
					<ChannelCard
						id="email"
						title="Email"
						description="Send all notifications to your email address."
						checked={channel === 'email'}
						onSelect={() => setChannel('email')}
					/>

					<ChannelCard
						id="sms"
						title="SMS"
						description="Send alerts as text messages when possible."
						checked={channel === 'sms'}
						onSelect={() => setChannel('sms')}
					/>

					<ChannelCard
						id="both"
						title="Both"
						description="Use both email and SMS whenever available."
						checked={channel === 'both'}
						onSelect={() => setChannel('both')}
					/>
				</div>
			</section>

			{/* INDIVIDUAL NOTIFICATION TYPES */}
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Notification types</h2>

				<div className="mt-4 space-y-4">
					<NotificationRow
						title="News & updates"
						description="New features, announcements, and product updates."
						enabled={newsUpdates}
						onToggle={setNewsUpdates}
					/>

					<NotificationRow
						title="Progress"
						description="Milestones, streak reminders, and study summaries."
						enabled={progressUpdates}
						onToggle={setProgressUpdates}
					/>

					<NotificationRow
						title="Inactivity"
						description="Gentle nudges when you haven’t studied in a while."
						enabled={inactivityAlerts}
						onToggle={setInactivityAlerts}
					/>

					<NotificationRow
						title="Trial alerts"
						description="Heads up before a trial or subscription period ends."
						enabled={trialAlerts}
						onToggle={setTrialAlerts}
					/>
				</div>
			</section>
		</div>
	);
}

/* === Helper components === */

type ChannelCardProps = {
	id: string;
	title: string;
	description: string;
	checked: boolean;
	onSelect: () => void;
};

function ChannelCard({ id, title, description, checked, onSelect }: ChannelCardProps) {
	return (
		<label
			htmlFor={id}
			className={[
				'group flex cursor-pointer flex-col gap-3 rounded-lg border border-black/5 bg-white/70 p-4',
				'transition-all hover:-translate-y-0.5 hover:shadow-sm',
				checked && 'border-[#c48757] bg-[#fff5eb] shadow-sm'
			].join(' ')}
		>
			<div className="flex items-start gap-3">
				<input
					id={id}
					type="radio"
					name="notificationChannel"
					checked={checked}
					onChange={onSelect}
					className="mt-1 h-4 w-4 cursor-pointer accent-[#c48757]"
				/>
				<div>
					<p className="text-xl font-semibold text-neutral-900">{title}</p>
					<p className="text-md text-neutral-600">{description}</p>
				</div>
			</div>
		</label>
	);
}

type NotificationRowProps = {
	title: string;
	description: string;
	enabled: boolean;
	onToggle: (value: boolean) => void;
};

function NotificationRow({ title, description, enabled, onToggle }: NotificationRowProps) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-lg border border-black/5 bg-white/70 px-4 py-3">
			<div>
				<p className="text-xl font-semibold text-neutral-900">{title}</p>
				<p className="text-md text-neutral-600">{description}</p>
			</div>

			<ToggleSwitch checked={enabled} onChange={() => onToggle(!enabled)} />
		</div>
	);
}

type ToggleSwitchProps = {
	checked: boolean;
	onChange: () => void;
};

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={onChange}
			className={[
				'relative inline-flex h-7 w-12 items-center rounded-full border border-black/10 transition-colors',
				checked ? 'bg-[#6abf8a]' : 'bg-neutral-300'
			].join(' ')}
		>
			<span
				className={[
					'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
					checked ? 'translate-x-5' : 'translate-x-1'
				].join(' ')}
			/>
		</button>
	);
}
