import React from 'react';
import { MessageSquare } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = '919363616921',
  message = 'Hello SRM Homes Team! I would like to inquire about an architectural construction project.',
}: WhatsAppButtonProps) {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 group flex items-center">
      {/* Tooltip on hover */}
      <span className="mr-3 px-3 py-1.5 bg-neutral-charcoal text-white text-xs font-semibold rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
        Chat with us on WhatsApp (+91 93636 16921)
      </span>


      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact SRM Homes on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40 pointer-events-none" />

        {/* WhatsApp Icon */}
        <MessageSquare className="w-7 h-7 fill-current relative z-10" />
      </a>
    </div>
  );
}
