import { useState } from "react";
import { motion } from "framer-motion";
import { useStore, Deadline } from "../store";
import { differenceInDays, differenceInHours } from "date-fns";
import { X, Plus, Edit } from "lucide-react";
import DeadlineModal from "./DeadlineModal";

function getUrgencyColor(deadline: Date): string {
  const hoursLeft = differenceInHours(deadline, new Date());
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
  if (hoursLeft < 24) return "rgba(239, 68, 68, 0.8)";
  if (hoursLeft < 72) return "rgba(245, 158, 11, 0.8)";
  if (hoursLeft < 168) return "rgba(59, 130, 246, 0.8)";
  return "rgba(6, 182, 212, 0.8)";
}

function getUrgencyPulse(): boolean {
  return false; // Disable pulse for all urgency levels
}

function getUrgencyVibration(_deadline: Date): boolean {
  return false; // Disable vibration
}

function getUrgencyText(deadline: Date, estimatedHours: number): string {
  const now = new Date();
  const daysLeft = differenceInDays(deadline, now);
  const hoursLeft = differenceInHours(deadline, now);
  const workHoursLeft = Math.max(0, hoursLeft - daysLeft * 16);

  if (hoursLeft < 24) {
    return `${hoursLeft}h left. You need ${estimatedHours}h. This is not happening.`;
  }
  if (hoursLeft < 72) {
    return `${daysLeft} days, ${hoursLeft % 24}h left. You need ${estimatedHours}h. This is a you problem.`;
  }
  if (estimatedHours > workHoursLeft) {
    return `${daysLeft} days left. You need ${estimatedHours}h. You have ${workHoursLeft}h work hours. Good luck.`;
  }
  return `${daysLeft} days left. You need ${estimatedHours}h. This is fine. Probably.`;
}

function DeadlineCard({
  deadline,
  onRemove,
  onEdit,
}: {
  deadline: Deadline;
  onRemove: (id: string) => void;
  onEdit: (deadline: Deadline) => void;
}) {
  const now = new Date();
  const deadlineDate =
    deadline.deadline instanceof Date
      ? deadline.deadline
      : new Date(deadline.deadline);
  const totalHours = differenceInHours(
    deadlineDate,
    new Date(deadlineDate.getTime() - 30 * 24 * 60 * 60 * 1000),
  );
  const hoursLeft = differenceInHours(deadlineDate, now);
  const progress = Math.max(0, Math.min(1, hoursLeft / totalHours));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);
  const shouldPulse = getUrgencyPulse();
  const shouldVibrate = getUrgencyVibration(deadlineDate);
  const ringColor = getUrgencyRingColor(deadlineDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={
        shouldVibrate
          ? {
              opacity: 1,
              y: 0,
              x: [0, -2, 2, -2, 2, 0],
            }
          : {
              opacity: 1,
              y: 0,
            }
      }
      transition={{
        duration: shouldVibrate ? 0.5 : 0.5,
        x: shouldVibrate ? { repeat: Infinity, duration: 0.3 } : undefined,
      }}
      whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${ringColor}20` }}
      whileTap={{ scale: 0.98 }}
      className={`glass rounded-xl p-3 relative ${getUrgencyColor(deadlineDate)}`}
    >
      {shouldPulse && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              `0 0 20px ${ringColor}`,
              `0 0 40px ${ringColor}`,
              `0 0 20px ${ringColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ pointerEvents: "none" }}
        />
      )}

      <button
        onClick={() => onRemove(deadline.id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors z-10 hover:scale-110 active:scale-95"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3">
        <div className="relative">
          <svg className="w-20 h-20" viewBox="0 0 100 100">
            <defs>
              <radialGradient
                id={`urgencyGradient-${deadline.id}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop offset="0%" stopColor={ringColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={ringColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#urgencyGradient)" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={ringColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "50px 50px",
              }}
            />
            {shouldPulse && (
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={ringColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{
                  strokeDashoffset: [circumference, 0],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50px 50px",
                }}
              />
            )}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-semibold tabular-nums tracking-wide">
              {differenceInDays(deadlineDate, now)}d
            </span>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-base font-semibold mb-1 tracking-tight">
            {deadline.title}
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            {getUrgencyText(deadlineDate, deadline.estimatedHours)}
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
        className="absolute bottom-2 right-2 text-gray-500 hover:text-cyan-400 transition-colors z-10 hover:scale-110 active:scale-95"
        title="Edit deadline"
      >
        <Edit size={14} />
      </button>
    </motion.div>
  );
}

export default function DeadlineCards() {
  const { deadlines, removeDeadline } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<
    Deadline | undefined
  >();

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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-200">Deadlines</h2>
        <button
          onClick={handleAdd}
          className="text-cyan-400 hover:text-cyan-300 transition-colors hover:scale-110 active:scale-95"
          title="Add deadline"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="grid gap-2">
        {deadlines.map((deadline) => (
          <DeadlineCard
            key={deadline.id}
            deadline={deadline}
            onRemove={removeDeadline}
            onEdit={handleEdit}
          />
        ))}
      </div>
      <DeadlineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deadline={editingDeadline}
      />
    </div>
  );
}
