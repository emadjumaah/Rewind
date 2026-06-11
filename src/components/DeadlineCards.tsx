import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore, Deadline } from "../store";
import { useT, useDir } from "../i18n";
import { differenceInDays, differenceInHours } from "date-fns";
import { X, Plus, Edit } from "lucide-react";
import DeadlineModal from "./DeadlineModal";
import DrainCircle from "./DrainCircle";
import { urgencyCardClasses, urgencyColor } from "../lib/urgency";
import { hoursUntil } from "../lib/time";

function getUrgencyText(deadline: Deadline, currentTime: Date, T: ReturnType<typeof useT>): string {
  const date = deadline.deadline instanceof Date ? deadline.deadline : new Date(deadline.deadline);
  const daysLeft = differenceInDays(date, currentTime);
  const hoursLeft = differenceInHours(date, currentTime);

  // Life countdowns have no "estimated hours" — they're just time, not a task.
  if (deadline.category === 'life') {
    if (hoursLeft < 0) return T.lifePassed(Math.abs(daysLeft));
    if (daysLeft < 1) return T.lifeToday();
    return T.lifeAway(daysLeft);
  }

  const estimatedHours = deadline.estimatedHours;
  const workHoursLeft = Math.max(0, hoursLeft - daysLeft * 16);
  if (hoursLeft < 0)   return T.overdue(Math.abs(daysLeft));
  if (hoursLeft < 24)  return T.urgentCritical(hoursLeft, estimatedHours);
  if (hoursLeft < 72)  return T.urgentHigh(daysLeft, hoursLeft % 24, estimatedHours);
  if (estimatedHours > workHoursLeft) return T.urgentMedium(daysLeft, estimatedHours, workHoursLeft);
  return T.normal(daysLeft, estimatedHours);
}

function DeadlineCard({
  deadline,
  onRemove,
  onEdit,
  currentTime,
}: {
  deadline: Deadline;
  onRemove: (id: string) => void;
  onEdit: (deadline: Deadline) => void;
  currentTime: Date;
}) {
  const T = useT();
  const deadlineDate =
    deadline.deadline instanceof Date
      ? deadline.deadline
      : new Date(deadline.deadline);

  const totalHours = differenceInHours(
    deadlineDate,
    new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const hoursLeft = differenceInHours(deadlineDate, currentTime);
  const daysLeft = differenceInDays(deadlineDate, currentTime);
  const progress = Math.max(0, Math.min(1, hoursLeft / totalHours));
  const ringColor = urgencyColor(hoursLeft);
  const isOverdue = hoursLeft < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className={`glass rounded-xl p-3 relative ${urgencyCardClasses(hoursLeft)}`}
    >
      <button
        onClick={() => onRemove(deadline.id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors z-10"
      >
        <X size={15} />
      </button>

      <div className="flex items-start gap-3">
        <div className="relative shrink-0 w-16 h-16">
          <DrainCircle size={64} progress={progress} color={ringColor} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold tabular-nums text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              {isOverdue ? `+${Math.abs(daysLeft)}d` : `${daysLeft}d`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-5">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-sm font-semibold tracking-tight truncate">
              {deadline.title}
            </h3>
            {deadline.demo && (
              <span className="shrink-0 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20 bg-white/10 text-gray-400">
                {T.demoBadge}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            {getUrgencyText(deadline, currentTime, T)}
          </p>
          <p className="text-gray-500 text-[10px] mt-1 tabular-nums">
            {deadlineDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <button
        onClick={() => onEdit(deadline)}
        className="absolute bottom-2 right-2 text-gray-600 hover:text-blue-400 transition-colors z-10"
        title="Edit"
      >
        <Edit size={13} />
      </button>
    </motion.div>
  );
}

function DeadlineCards({ currentTime }: { currentTime: Date }) {
  const { deadlines, removeDeadline, isDeadlineModalOpen, setDeadlineModalOpen } = useStore();
  const T = useT();
  const dir = useDir();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Deadline | undefined>();

  // Triggered by CommandPalette ⌘D
  useEffect(() => {
    if (isDeadlineModalOpen) {
      setEditingDeadline(undefined);
      setIsModalOpen(true);
      setDeadlineModalOpen(false);
    }
  }, [isDeadlineModalOpen, setDeadlineModalOpen]);

  const handleAdd = () => {
    setEditingDeadline(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (deadline: Deadline) => {
    setEditingDeadline(deadline);
    setIsModalOpen(true);
  };

  // Honest ordering: the loudest thing first. Most overdue at the very top,
  // then the soonest upcoming, with distant dates settling to the bottom.
  const sorted = [...deadlines].sort((a, b) => {
    const da = a.deadline instanceof Date ? a.deadline : new Date(a.deadline);
    const db = b.deadline instanceof Date ? b.deadline : new Date(b.deadline);
    return hoursUntil(da, currentTime) - hoursUntil(db, currentTime);
  });

  return (
    <div className="flex flex-col md:h-full gap-2" dir={dir}>
      {/* Header — fixed, never scrolls away */}
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">{T.deadlines}</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded-md hover:bg-blue-500/10"
          title={T.addDeadlineTooltip}
        >
          <Plus size={14} />
          <span>{T.add}</span>
        </button>
      </div>

      {deadlines.some((d) => d.demo) && (
        <p className="text-[10px] text-gray-500 shrink-0 -mt-1 px-1">{T.demoHint}</p>
      )}

      {deadlines.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full py-5 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-blue-500/50 hover:text-blue-400 transition-all text-sm"
        >
          {T.addFirst}
        </button>
      ) : (
        /* Scrollable list — fills remaining height on desktop, natural flow on mobile */
        <div className="deadline-list grid gap-2.5 md:overflow-y-auto md:flex-1 md:min-h-0 px-2 py-1">
          {sorted.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              onRemove={removeDeadline}
              onEdit={handleEdit}
              currentTime={currentTime}
            />
          ))}
          <button
            onClick={handleAdd}
            className="w-full py-2 border border-dashed border-gray-800 hover:border-blue-500/40 rounded-lg text-gray-600 hover:text-blue-400 transition-all text-xs"
          >
            {T.addAnother}
          </button>
        </div>
      )}

      <DeadlineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deadline={editingDeadline}
      />
    </div>
  );
}

// Only re-render from currentTime prop when the hour changes —
// deadline store changes still trigger re-renders via zustand subscription
export default React.memo(DeadlineCards, (prev, next) =>
  prev.currentTime.getHours() === next.currentTime.getHours() &&
  prev.currentTime.getDate() === next.currentTime.getDate()
)
