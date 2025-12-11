'use client';

import { useState } from 'react';
import { NumberStepper } from '../components/NumberStepper';
import { ReviewModeOptions, type ReviewMode } from '../components/ReviewModeOptions';
import { ReviewOrderOptions, type ReviewOrder } from '../components/ReviewOrderOptions';
import { Button } from '@/components/ui/button';
import { ValidationBubble } from '../components/ValidationBubble';

export default function ReviewsSettingsPage() {
	const [lessonCap, setLessonCap] = useState<number | ''>(0);
	const [lessonBatchSize, setLessonBatchSize] = useState<number | ''>(5);

	const [reviewMode, setReviewMode] = useState<ReviewMode>('standard');
	const [reviewOrder, setReviewOrder] = useState<ReviewOrder>('mixed');
	const [hasTriedSave, setHasTriedSave] = useState(false);

	const LESSON_CAP_MIN = 0;
	const LESSON_CAP_MAX = 200;
	const BATCH_MIN = 1;
	const BATCH_MAX = 20;

	const isLessonCapInvalid = (v: number | '') =>
		typeof v !== 'number' || v < LESSON_CAP_MIN || v > LESSON_CAP_MAX;

	const isBatchInvalid = (v: number | '') =>
		typeof v !== 'number' || v < BATCH_MIN || v > BATCH_MAX;

	const hasErrors = isLessonCapInvalid(lessonCap) || isBatchInvalid(lessonBatchSize);

	const lessonCapError =
		hasTriedSave && isLessonCapInvalid(lessonCap)
			? `Value must be between ${LESSON_CAP_MIN} and ${LESSON_CAP_MAX}.`
			: null;

	const batchSizeError =
		hasTriedSave && isBatchInvalid(lessonBatchSize)
			? `Value must be between ${BATCH_MIN} and ${BATCH_MAX}.`
			: null;

	const handleSave = () => {
		setHasTriedSave(true);

		if (hasErrors) {
			// block save – errors will render now
			return;
		}

		// safe to cast because invalid states are caught above
		const lc = lessonCap as number;
		const bs = lessonBatchSize as number;

		console.log('Saving settings', {
			lessonCap: lc,
			lessonBatchSize: bs,
			reviewMode,
			reviewOrder
		});
	};

	return (
		<div className="space-y-10">
			<header>
				<h1 className="text-4xl font-bold text-neutral-900">SRS &amp; Reviews</h1>
			</header>

			{/* LESSON SETTINGS */}
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Lessons</h2>

				{/* two cards side by side on desktop */}
				<div className="mt-4 grid gap-6 md:grid-cols-2">
					{/* Daily lesson cap */}
					<div className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white/70 p-4">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="text-xl font-semibold text-neutral-900">Daily lesson cap</p>
								<p className="text-md text-neutral-600">
									Max number of new lessons you can start in a single day.
								</p>
							</div>

							<NumberStepper
								value={lessonCap}
								onChange={setLessonCap}
								min={LESSON_CAP_MIN}
								max={LESSON_CAP_MAX}
							/>
						</div>

						{/* Centered bubble under the whole card */}
						{lessonCapError && <ValidationBubble message={lessonCapError} />}
					</div>

					{/* Lesson batch size */}
					<div className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white/70 p-4">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<p className="text-xl font-semibold text-neutral-900">Lesson batch size</p>
								<p className="text-md text-neutral-600">
									How many new items appear together in one lesson session.
								</p>
							</div>

							<NumberStepper
								value={lessonBatchSize}
								onChange={setLessonBatchSize}
								min={BATCH_MIN}
								max={BATCH_MAX}
							/>
						</div>

						{batchSizeError && <ValidationBubble message={batchSizeError} />}
					</div>
				</div>

				{/* Centered Save button */}
				<div className="mt-6 flex justify-center">
					<Button
						type="button"
						variant="leaf"
						size="lg"
						onClick={handleSave}
						className="px-10 text-lg font-semibold"
					>
						Save
					</Button>
				</div>
			</section>

			{/* REVIEW SETTINGS */}
			<section className="space-y-6 rounded-xl border border-black/5 bg-[#fffdf9] p-6 sm:p-8">
				<h2 className="text-3xl font-semibold text-neutral-900">Reviews</h2>

				<div className="mt-4">
					<ReviewModeOptions value={reviewMode} onChange={setReviewMode} />
				</div>

				<div className="mt-8">
					<ReviewOrderOptions value={reviewOrder} onChange={setReviewOrder} />
				</div>
			</section>
		</div>
	);
}
