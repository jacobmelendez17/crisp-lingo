'use client';

import { useState } from 'react';
import { NumberStepper } from '../components/NumberStepper';
import { ReviewModeOptions, type ReviewMode } from '../components/ReviewModeOptions';
import { ReviewOrderOptions, type ReviewOrder } from '../components/ReviewOrderOptions';

export default function ReviewsSettingsPage() {
	const [lessonCap, setLessonCap] = useState(20);
	const [lessonBatchSize, setLessonBatchSize] = useState(5);

	const [reviewMode, setReviewMode] = useState<ReviewMode>('standard');
	const [reviewOrder, setReviewOrder] = useState<ReviewOrder>('mixed');

	return (
		<div className="space-y-8">
			<header>
				<h1 className="text-3xl font-bold text-neutral-900">SRS &amp; Reviews</h1>
				<p className="mt-1 text-sm text-neutral-500">
					Tune how many lessons you see per day and how your reviews are scheduled.
				</p>
			</header>

			{/* LESSON SETTINGS */}
			<section className="space-y-4 rounded-xl border border-black/5 bg-[#fffdf9] p-4 sm:p-6">
				<h2 className="text-xl font-semibold text-neutral-800">Lessons</h2>
				<p className="text-sm text-neutral-500">
					Control how many new items you unlock and how big each lesson batch is.
				</p>

				<div className="mt-4 space-y-4">
					{/* Lesson cap */}
					<div className="flex flex-col gap-2 rounded-lg border border-black/5 bg-white/60 p-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-semibold text-neutral-800">Daily lesson cap</p>
							<p className="text-xs text-neutral-500">
								Max number of new lessons you can start in a single day.
							</p>
						</div>

						<NumberStepper
							value={lessonCap}
							onChange={(v) => setLessonCap(Math.max(0, Math.min(200, v)))}
							min={0}
							max={200}
						/>
					</div>

					{/* Lesson batch size */}
					<div className="flex flex-col gap-2 rounded-lg border border-black/5 bg-white/60 p-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-semibold text-neutral-800">Lesson batch size</p>
							<p className="text-xs text-neutral-500">
								How many new items appear together in one lesson session.
							</p>
						</div>

						<NumberStepper
							value={lessonBatchSize}
							onChange={(v) => setLessonBatchSize(Math.max(1, Math.min(20, v)))}
							min={1}
							max={20}
						/>
					</div>
				</div>
			</section>

			{/* REVIEW SETTINGS */}
			<section className="space-y-4 rounded-xl border border-black/5 bg-[#fffdf9] p-4 sm:p-6">
				<h2 className="text-xl font-semibold text-neutral-800">Reviews</h2>
				<p className="text-sm text-neutral-500">
					Choose how intense your review sessions feel and how items are ordered.
				</p>

				{/* Review mode: radio cards with image/name/description */}
				<div className="mt-4">
					<ReviewModeOptions value={reviewMode} onChange={setReviewMode} />
				</div>

				{/* Review order: simple radio rows */}
				<div className="mt-6">
					<ReviewOrderOptions value={reviewOrder} onChange={setReviewOrder} />
				</div>
			</section>
		</div>
	);
}
