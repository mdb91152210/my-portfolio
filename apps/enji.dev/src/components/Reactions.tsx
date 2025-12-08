import { m, useAnimationControls } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import EmojiReaction from '@/components/EmojiReaction';
import InsightButton from '@/components/InsightButton';
import ShareButton from '@/components/ShareButton';

import useInsight from '@/hooks/useInsight';
import useScrollSpy from '@/hooks/useScrollSpy';

import { MAX_REACTIONS_PER_SESSION } from '@/constants/app';

import type { PropsWithChildren } from 'react';

/** -------------------------------------------------------
 *  REPLACE PRISMA CONTENTTYPE WITH CUSTOM TYPE
 * ------------------------------------------------------ */
export type ContentType = 'POST' | 'BLOG' | 'PROJECT' | 'PAGE';

/** -------------------------------------------------------
 *  Counter component
 * ------------------------------------------------------ */

interface CounterProps {
  count: number;
}

function Counter({ count }: CounterProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (count !== 0) {
      controls.start({
        y: [-20, 0],
        transition: { duration: 0.18 },
      });
    }
  }, [count, controls]);

  return count === 0 ? (
    <span className="flex flex-col font-mono text-sm">
      <span className="flex h-5 items-center font-mono text-sm font-bold text-slate-600 dark:text-slate-300">
        0
      </span>
    </span>
  ) : (
    <m.span
      className="flex flex-col font-mono text-sm font-bold text-slate-600 dark:text-slate-300"
      animate={controls}
    >
      <span className="flex h-5 items-center">&nbsp;</span>
      <span className="flex h-5 items-center">{count}</span>
      <span className="flex h-5 items-center">{count - 1}</span>
    </m.span>
  );
}

/** Reaction Counter */

type ReactionCounterProps = PropsWithChildren<CounterProps>;

function ReactionCounter({ count, children = null }: ReactionCounterProps) {
  return (
    <div className="relative flex h-6 items-center gap-1 overflow-hidden rounded-full bg-slate-200 px-2 py-1 dark:bg-[#1d263a]">
      {children}
      <Counter count={count} />
    </div>
  );
}

/** -------------------------------------------------------
 *   MAIN COMPONENT (FIXED)
 * ------------------------------------------------------ */

export type ReactionsProps = {
  contentType: ContentType;
  contentTitle: string;
  withCountView?: boolean;
};

function Reactions({
  contentType,
  contentTitle,
  withCountView = true,
}: ReactionsProps) {
  const { pathname } = useRouter();
  const slug = pathname.split('/').reverse()[0];

  const { currentSection } = useScrollSpy();

  const {
    isLoading,
    data: {
      meta: {
        views,
        shares,
        reactions,
        reactionsDetail: { THINKING, CLAPPING, AMAZED },
      },
      metaUser: { reactionsDetail: user },
    },
    addShare,
    addReaction,
  } = useInsight({ slug, contentType, contentTitle, countView: withCountView });

  const CLAPPING_QUOTA = MAX_REACTIONS_PER_SESSION - user.CLAPPING;
  const THINKING_QUOTA = MAX_REACTIONS_PER_SESSION - user.THINKING;
  const AMAZED_QUOTA = MAX_REACTIONS_PER_SESSION - user.AMAZED;

  const controls = useAnimationControls();

  useEffect(() => {
    if (!isLoading) {
      controls.start({
        y: 0,
        opacity: 1,
        pointerEvents: 'auto',
        transition: { delay: 0.24, duration: 0.18 },
      });
    }
  }, [isLoading, controls]);

  return (
    <m.div
      className="border-divider-light dark:border-divider-dark pointer-events-auto relative flex items-center justify-between rounded-xl border p-4"
      initial={{ y: 16, opacity: 0, pointerEvents: 'none' }}
      animate={controls}
    >
      <div className="absolute inset-0 rounded-xl bg-white/70 backdrop-blur dark:bg-slate-900/80" />

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <EmojiReaction
            disabled={CLAPPING_QUOTA <= 0}
            title="Claps"
            defaultImage="/assets/emojis/clapping-hands.png"
            animatedImage="/assets/emojis/clapping-hands-animated.png"
            disabledImage="/assets/emojis/love-you-gesture.png"
            onClick={() =>
              addReaction({ type: 'CLAPPING', section: currentSection })
            }
          />
          <ReactionCounter count={CLAPPING} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <EmojiReaction
            disabled={AMAZED_QUOTA <= 0}
            title="Wow"
            defaultImage="/assets/emojis/astonished-face.png"
            animatedImage="/assets/emojis/astonished-face-animated.png"
            disabledImage="/assets/emojis/star-struck.png"
            onClick={() =>
              addReaction({ type: 'AMAZED', section: currentSection })
            }
          />
          <ReactionCounter count={AMAZED} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <EmojiReaction
            disabled={THINKING_QUOTA <= 0}
            title="Hmm"
            defaultImage="/assets/emojis/face-with-monocle.png"
            animatedImage="/assets/emojis/face-with-monocle-animated.png"
            disabledImage="/assets/emojis/nerd-face.png"
            onClick={() =>
              addReaction({ type: 'THINKING', section: currentSection })
            }
          />
          <ReactionCounter count={THINKING} />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex flex-col items-center gap-2">
          <InsightButton views={views} shares={shares} reactions={reactions} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <ShareButton onItemClick={(type) => addShare({ type })} />
          <ReactionCounter count={shares} />
        </div>
      </div>
    </m.div>
  );
}

export default Reactions;
