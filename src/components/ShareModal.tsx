import React from 'react';
import { XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  if (!isOpen) return null;

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Family Todo List');
    const body = encodeURIComponent(`Check out our family todo list: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(`Check out our family todo list: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`);
  };

  const shareViaSMS = () => {
    const text = encodeURIComponent(`Check out our family todo list: ${shareUrl}`);
    window.open(`sms:?&body=${text}`);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Share Todo List</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <button
              onClick={shareViaEmail}
              className="btn bg-blue-500 text-white hover:bg-blue-600 w-full py-3 rounded-lg"
            >
              Share via Email
            </button>
            
            <button
              onClick={shareViaWhatsApp}
              className="btn bg-green-500 text-white hover:bg-green-600 w-full py-3 rounded-lg"
            >
              Share via WhatsApp
            </button>
            
            <button
              onClick={shareViaSMS}
              className="btn bg-purple-500 text-white hover:bg-purple-600 w-full py-3 rounded-lg"
            >
              Share via SMS
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 border rounded-lg bg-gray-50"
            />
            <button
              onClick={copyToClipboard}
              className="btn bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};