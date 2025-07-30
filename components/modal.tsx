import React from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="fixed inset-0 bg-black/30 " aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl transition-all">
          <div className="flex justify-between items-center mb-4">
            {title && <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>}
            {showCloseButton && (
              <button onClick={onClose} className="text-gray-500 cursor-pointer hover:text-gray-800 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
