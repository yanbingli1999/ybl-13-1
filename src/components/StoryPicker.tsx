import { Scroll, Flame, Heart } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import type { Story, StoryBranch } from '@/types'
import { calcStoryHeat } from '@/utils/storyHeat'
import { calcSerialExpect } from '@/utils/serialExpect'

export default function StoryPicker() {
  const {
    availableStories,
    selectStory,
    currentStory,
    currentBranch,
    reputation,
    storyHistory,
    day,
    lastStoryDay,
    storyScores,
    startPerformance,
  } = useGameStore()

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <Scroll className="w-6 h-6" /> 选择今日故事
      </h2>
      <p className="text-sm text-ink-light mb-4">从备选故事中挑选一篇，并选择讲述分支</p>

      {!currentStory ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableStories.map((story) => {
            const heat = calcStoryHeat(story, story.branches[0], storyHistory, reputation)
            const expect = calcSerialExpect(story.id, day, lastStoryDay, storyScores)
            return (
              <div key={story.id} className="card-ancient cursor-pointer hover:-translate-y-1 transition-all border-2 hover:border-gold group">
                <div className="aspect-[3/4] flex flex-col items-center justify-center bg-gradient-to-b from-paper to-paper-dark rounded-lg mb-3 border border-sandal/30">
                  <span className="text-5xl mb-2">📜</span>
                  <span className="font-brush text-xl text-sandal">{story.title}</span>
                </div>

                <div className="text-xs text-ink-light mb-2">{story.summary}</div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {story.tags.map((t) => (
                    <span key={t} className="tag-chip">#{t}</span>
                  ))}
                </div>

                <div className="flex justify-between text-sm mb-3">
                  <div className="flex items-center gap-1 text-cinnabar">
                    <Flame className="w-4 h-4" /> 热度 {heat.value}
                  </div>
                  <div className="flex items-center gap-1 text-gold">
                    <Heart className="w-4 h-4" /> 期待 {expect.value}
                  </div>
                </div>

                <div className="border-t border-sandal/20 pt-2">
                  <div className="text-xs text-ink-light mb-2">选择分支：</div>
                  <div className="flex flex-col gap-1.5">
                    {story.branches.map((b: StoryBranch) => (
                      <button
                        key={b.id}
                        onClick={() => selectStory(story.id, b.id)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-paper-dark/50 hover:bg-gold/30 text-sm transition-all border border-sandal/20 hover:border-gold"
                      >
                        <div className="font-medium">{b.title}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {b.tags.map((t) => (
                            <span key={t} className="text-[10px] text-tea">#{t}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card-ancient">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-sm text-ink-light">已选故事</div>
              <div className="font-brush text-2xl text-sandal">{currentStory.title}</div>
              <div className="font-song text-lg text-ink mt-1">{currentBranch?.title}</div>
            </div>
            <button
              onClick={startPerformance}
              className="btn-gold text-lg px-6 py-3"
            >
              🎭 开讲！
            </button>
          </div>
          <div className="p-4 bg-paper-dark/30 rounded-lg border border-sandal/20 font-song leading-relaxed text-ink">
            {currentBranch?.content}
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {currentBranch?.tags.map((t) => (
              <span key={t} className="tag-chip">#{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
