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
		<div className="space-y-10">
			<header>
				<h1 className="text-4xl font-bold text-neutral-900">SRS &amp; Reviews</h1>
			</header>

			{/* LESSON SETTINGS */}
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Lessons</h2>

				<div className="mt-4 space-y-6">
					{/* Lesson cap */}
					<div className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xl font-semibold text-neutral-900">Daily lesson cap</p>
							<p className="text-md text-neutral-600">
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
					<div className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xl font-semibold text-neutral-900">Lesson batch size</p>
							<p className="text-md text-neutral-600">
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
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Reviews</h2>

				{/* Review mode: radio cards */}
				<div className="mt-4">
					<ReviewModeOptions value={reviewMode} onChange={setReviewMode} />
				</div>

				{/* Review order */}
				<div className="mt-8">
					<ReviewOrderOptions value={reviewOrder} onChange={setReviewOrder} />
				</div>
			</section>
		</div>
	);
}
