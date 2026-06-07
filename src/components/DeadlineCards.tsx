import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore, Deadline } from "../store";
import { differenceInDays, differenceInHours } from "date-fns";
import { X, Plus, Edit } from "lucide-react";
import DeadlineModal from "./DeadlineModal";

function getUrgencyColor(deadline: Date): string {
  const hoursLeft = differenceInHours(deadline, new Date());
  if (hoursLeft < 0)
    return "border-2 border-red-700/70 shadow-md shadow-red-700/20 bg-gradient-to-br from-red-900/25 to-red-950/10";
  if (hoursLeft < 24)
    return "border-2 border-red-500/60 shadow-md shadow-red-500/20 bg-gradient-to-br from-red-500/15 to-red-900/5";
  if (hoursLeft < 72)
    return "border-2 border-amber-500/50 shadow-md shadow-amber-500/15 bg-gradient-to-br from-amber-500/10 to-amber-900/5";
  if (hoursLeft < 168)
    return "border border-blue-500/40 shadow-sm shadow-blue-500/10 bg-gradient-to-br from-blue-500/5 to-blue-900/5";
  return "border border-cyan-500/30 shadow-sm shadow-cyan-500/5 bg-gradient-to-br from-cyan-500/5 to-cyan-900/5";
}

function getUrgencyRingColor(deadline: Date): string {
  const hoursLeft = differenceInHours(deadline, new Date());
  if (hoursLeft < 0)  return "rgba(220, 38, 38, 0.9)";
  if (hoursLeft < 24) return "rgba(239, 68, 68, 0.8)";
  if (hoursLeft < 72) return "rgba(245, 158, 11, 0.8)";
  if (hoursLeft < 168) return "rgba(59, 130, 246, 0.8)";
  return "rgba(6, 182, 212, 0.8)";
}

function getUrgencyText(deadline: Date, estimatedHours: number, currentTime: Date): string {
  const daysLeft = differenceInDays(deadline, currentTime);
  const hoursLeft = differenceInHours(deadline, currentTime);
  const workHoursLeft = Math.max(0, hoursLeft - daysLeft * 16);

  if (hoursLeft < 0)
    return `${Math.abs(daysLeft)}d overdue. This is a you problem now.`;
  if (hoursLeft < 24)
    return `${hoursLeft}h left. You need ${estimatedHours}h. This is not happening.`;
  if (hoursLeft < 72)
    return `${daysLeft} days, ${hoursLeft % 24}h left. You need ${estimatedHours}h. This is a you problem.`;
  if (estimatedHours > workHoursLeft)
    return `${daysLeft} days left. You need ${estimatedHours}h. You have ${workHoursLeft}h work hours. Good luck.`;
  return `${daysLeft} days left. You need ${estimatedHours}h. This is fine. Probably.`;
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
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);
  const ringColor = getUrgencyRingColor(deadlineDate);
  const isOverdue = hoursLeft < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`glass rounded-xl p-3 relative ${getUrgencyColor(deadlineDate)}`}
    >
      <button
        onClick={() => onRemove(deadline.id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors z-10"
      >
        <X size={15} />
      </button>

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <svg className="w-16 h-16" viewBox="0 0 100 100">
            <defs>
              <radialGradient id={`ug-${deadline.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={ringColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={ringColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill={`url(#ug-${deadline.id})`} />
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke={ringColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50px 50px",
                transition: "stroke-dashoffset 1s ease-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-semibold tabular-nums ${isOverdue ? 'text-red-400' : ''}`}>
              {isOverdue ? `+${Math.abs(daysLeft)}d` : `${daysLeft}d`}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-5">
          <h3 className="text-sm font-semibold mb-1 tracking-tight truncate">
            {deadline.title}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            {getUrgencyText(deadlineDate, deadline.estimatedHours, currentTime)}
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
        className="absolute bottom-2 right-2 text-gray-600 hover:text-cyan-400 transition-colors z-10"
        title="Edit"
      >
        <Edit size={13} />
      </button>
    </motion.div>
  );
}

function DeadlineCards({ currentTime }: { currentTime: Date }) {
  const { deadlines, removeDeadline, isDeadlineModalOpen, setDeadlineModalOpen } = useStore();
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

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Deadlines</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors px-2 py-1 rounded-md hover:bg-cyan-500/10"
          title="Add deadline"
        >
          <Plus size={14} />
          <span>Add</span>
        </button>
      </div>

      {deadlines.length === 0 ? (
        <button
          onClick={handleAdd}
          className="w-full py-5 border border-dashed border-gray-700 rounded-xl text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-sm"
        >
          + Add your first deadline
        </button>
      ) : (
        <div className="grid gap-2">
          {deadlines.map((deadline) => (
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
            className="w-full py-2 border border-dashed border-gray-800 hover:border-cyan-500/40 rounded-lg text-gray-600 hover:text-cyan-400 transition-all text-xs"
          >
            + Add another
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
