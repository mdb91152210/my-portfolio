import merge from 'lodash/merge';
import { useEffect, useState } from 'react';

import type { TContentMetaDetail } from '@/types';

const INITIAL_VALUE: TContentMetaDetail = {
  meta: {
    views: 0,
    shares: 0,
    reactions: 0,
    reactionsDetail: {
      CLAPPING: 0,
      THINKING: 0,
      AMAZED: 0,
    },
  },
  metaUser: {
    reactionsDetail: {
      CLAPPING: 0,
      THINKING: 0,
      AMAZED: 0,
    },
  },
  metaSection: {},
};

export default function useInsight({
  slug,
  countView = true,
}: {
  slug: string;
  countView?: boolean;
}) {
  const [data, setData] = useState<TContentMetaDetail>(INITIAL_VALUE);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`insight-${slug}`);
    if (saved) setData(JSON.parse(saved));
    setIsLoading(false);
  }, [slug]);

  // Save and update localStorage
  const save = (newData: TContentMetaDetail) => {
    setData(newData);
    localStorage.setItem(`insight-${slug}`, JSON.stringify(newData));
  };

  // Count views
  useEffect(() => {
    if (!countView) return;

    const updated = merge({}, data, {
      meta: { views: data.meta.views + 1 },
    });

    save(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, countView]);

  // Add a share
  const addShare = () => {
    const updated = merge({}, data, {
      meta: { shares: data.meta.shares + 1 },
    });

    save(updated);
  };

  // Add reaction
  const addReaction = ({
    type,
  }: {
    type: 'CLAPPING' | 'THINKING' | 'AMAZED';
  }) => {
    const updated = merge({}, data, {
      meta: {
        reactions: data.meta.reactions + 1,
        reactionsDetail: {
          [type]: data.meta.reactionsDetail[type] + 1,
        },
      },
      metaUser: {
        reactionsDetail: {
          [type]: data.metaUser.reactionsDetail[type] + 1,
        },
      },
    });

    save(updated);
  };

  return {
    isLoading,
    data,
    addShare,
    addReaction,
  };
}
