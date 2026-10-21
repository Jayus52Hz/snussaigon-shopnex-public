"use client";

import { Share2, Link2, Check } from "lucide-react";
import { useState } from "react";

type BlogShareProps = {
    title: string;
    url: string;
};

export default function BlogShare({ title, url }: BlogShareProps) {
    const [copied, setCopied] = useState(false);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const input = document.createElement("input");
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareFb = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "width=600,height=400");
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1 mr-1">
                <Share2 className="h-3.5 w-3.5" />
                Chia sẻ:
            </span>
            <button
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                onClick={copyLink}
                title="Copy link"
                type="button"
            >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
            </button>
            <button
                className="p-1.5 rounded-md hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                onClick={shareFb}
                title="Share to Facebook"
                type="button"
            >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
        </div>
    );
}
