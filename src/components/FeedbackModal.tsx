import { CheckCircle, AlertCircle, Info, HelpCircle } from "lucide-react";

type ModalType = "success" | "error" | "info" | "confirmation";

interface Props {
  type: ModalType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function FeedbackModal({
  type,
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: Props) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        );
      case "error":
        return <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />;
      case "confirmation":
        return <HelpCircle className="w-12 h-12 text-blue-500 mx-auto mb-3" />;
      default:
        return <Info className="w-12 h-12 text-teal-500 mx-auto mb-3" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "error":
        return "btn-secondary text-red-600 border-red-200 hover:bg-red-50";
      case "confirmation":
        return "btn-primary";
      case "success":
        return "btn-primary bg-green-600 hover:bg-green-700 border-none";
      default:
        return "btn-primary";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="card max-w-sm w-full text-center p-6 shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        {getIcon()}

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          {type === "confirmation" ? (
            <>
              <button onClick={onClose} className="btn-secondary w-full">
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="btn-primary w-full"
              >
                {confirmLabel}
              </button>
            </>
          ) : (
            <button onClick={onClose} className={`${getButtonClass()} w-full`}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
