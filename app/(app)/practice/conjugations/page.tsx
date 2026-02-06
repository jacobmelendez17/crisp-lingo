import { getActiveUserId }from "@/db/getActiveUserId";
import { getUnlockedConjugations } from "@/db/queries";
import { CardShell } from "@/components/card-shell";
import { ConjugationSetup } from "./setup";

const UNLOCK_SRS_LEVEL = 5;

export default async function ConjugationSetUpPage() {
    const userId = await getActiveUserId();
    if (!userId) {
        return (
            <main className="mx-auto w-fu max-w-[1100px] px-4 py-10">
                <CardShell title="Verb Conjugation">
                    <p className="text-sm text-neutral-700">Please sign in to practice.</p>
                </CardShell>
            </main>
        );
    }

    const unlocked = await getUnlockedConjugations(userId);

    return (
        <main className="mx-auto w-full max-w-[1100px] px-4 py-10">
            <CardShell title="Verb Conjugation" className="bg-white">
                {unlocked.length === 0 ? (
                    <div className="rounded-2xl border border-black/5 bg-neutral-50 p-4">
                        <p className="text-sm text-neutral-800 font-medium">
                            Reach SRS Leve {UNLOCK_SRS_LEVEL} on grammar to unlock verb conjugations.
                        </p>
                        <p className="mt-1 text-sm text-neutral-600">
                            Keep studying grammar lessons - once they hit {UNLOCK_SRS_LEVEL}, they'll appear here.
                        </p>
                    </div>
                ) : (
                    <ConjugationSetup unlocked={unlocked} />
                )}
            </CardShell>
        </main>
    )
}