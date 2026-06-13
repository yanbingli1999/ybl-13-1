import { useState, useCallback } from 'react'
import { Armchair, Move } from 'lucide-react'
import { useGameStore } from '@/store/useGameStore'
import { GRID_COLS, GRID_ROWS, STAGE_POS, SEAT_PRICE_MULTIPLIER } from '@/data/seats'
import { calcSeatView } from '@/utils/seatView'

const TIER_COLORS: Record<string, string> = {
  普通: 'bg-sandal-light/50 border-sandal',
  雅座: 'bg-tea-light/50 border-tea',
  贵宾: 'bg-gold/60 border-gold',
}

export default function SeatGrid() {
  const { seats, renovations, moveSeat } = useGameStore()
  const [dragging, setDragging] = useState<number | null>(null)

  const viewCache = new Map(seats.map((s) => [s.id, calcSeatView(s, renovations)]))

  const handleCellDrop = useCallback(
    (x: number, y: number) => {
      if (dragging === null) return
      if (x === STAGE_POS.x && y === STAGE_POS.y) {
        setDragging(null)
        return
      }
      const occupied = seats.some((s) => s.x === x && s.y === y && s.id !== dragging)
      if (occupied) {
        setDragging(null)
        return
      }
      moveSeat(dragging, x, y)
      setDragging(null)
    },
    [dragging, seats, moveSeat]
  )

  return (
    <div className="scroll-panel">
      <h2 className="text-2xl font-brush text-sandal mb-2 flex items-center gap-2">
        <Armchair className="w-6 h-6" /> 座位排布
      </h2>
      <p className="text-sm text-ink-light mb-4">
        拖拽座位调整位置，距离说书台越近视野越好。点击座位查看视野评分
      </p>

      <div className="flex flex-wrap gap-4 mb-4">
        {(['贵宾', '雅座', '普通'] as const).map((t) => (
          <div key={t} className="flex items-center gap-2 text-sm">
            <div className={`w-4 h-4 rounded ${TIER_COLORS[t]} border-2`} />
            <span className="font-song">{t}座 · 票价倍率 x{SEAT_PRICE_MULTIPLIER[t]}</span>
          </div>
        ))}
      </div>

      <div
        className="relative bg-paper-dark/50 rounded-lg p-4 border-2 border-sandal/30"
        style={{ minHeight: 320 }}
      >
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0,1fr))` }}>
          {Array.from({ length: GRID_ROWS }).map((_, y) =>
            Array.from({ length: GRID_COLS }).map((__, x) => {
              const isStage = x === STAGE_POS.x && y === STAGE_POS.y
              const seat = seats.find((s) => s.x === x && s.y === y)

              if (isStage) {
                return (
                  <div
                    key={`${x}-${y}`}
                    className="aspect-square flex flex-col items-center justify-center bg-cinnabar/20 border-2 border-cinnabar rounded-lg"
                  >
                    <span className="text-2xl">🎭</span>
                    <span className="text-xs font-brush text-cinnabar">说书台</span>
                  </div>
                )
              }

              if (seat) {
                const view = viewCache.get(seat.id)?.value || 0
                return (
                  <div
                    key={`${x}-${y}`}
                    draggable
                    onDragStart={() => setDragging(seat.id)}
                    onDragEnd={() => setDragging(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleCellDrop(x, y)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg border-2 cursor-move transition-all ${TIER_COLORS[seat.tier]} ${dragging === seat.id ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-md'}`}
                  >
                    <Move className="w-3 h-3 text-ink-light absolute top-0.5 right-0.5 opacity-50" />
                    <span className="text-xl">{seat.occupied ? '👤' : '🪑'}</span>
                    <span className="text-[10px] font-song text-ink-light">{seat.tier}</span>
                    <div className="text-[10px] font-semibold" style={{ color: view > 70 ? '#6B8E5A' : view > 40 ? '#C9A24B' : '#A83232' }}>
                      视野 {view}
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={`${x}-${y}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleCellDrop(x, y)}
                  className="aspect-square flex items-center justify-center border-2 border-dashed border-sandal/20 rounded-lg text-sandal/30 text-xs hover:bg-sandal/5"
                >
                  空位
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
