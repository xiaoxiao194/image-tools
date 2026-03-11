"use client";
import { useState } from "react";

const categories = ["功能建议", "Bug 反馈", "体验优化", "其他"];

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("功能建议");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);

    // Submit to Google Form
    // Replace FORM_ID and entry IDs after creating your Google Form
    const GOOGLE_FORM_URL = "";

    if (GOOGLE_FORM_URL) {
      try {
        const formData = new URLSearchParams();
        formData.append("entry.1", category);
        formData.append("entry.2", message);
        formData.append("entry.3", contact);
        formData.append("entry.4", window.location.href);
        formData.append("entry.5", new Date().toISOString());
        await fetch(GOOGLE_FORM_URL, {
          method: "POST",
          body: formData,
          mode: "no-cors",
        });
      } catch (e) {
        // no-cors will always "fail" but data is submitted
      }
    }

    // Also save to localStorage as backup
    const feedbacks = JSON.parse(localStorage.getItem("photolab_feedbacks") || "[]");
    feedbacks.push({ category, message, contact, page: window.location.href, time: new Date().toISOString() });
    localStorage.setItem("photolab_feedbacks", JSON.stringify(feedbacks));

    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setMessage("");
      setContact("");
    }, 2000);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        title="意见反馈"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      {/* Feedback panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-[90] w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden fade-in">
          {submitted ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-gray-900 dark:text-white">感谢你的反馈！</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">我们会认真查看每一条建议</p>
            </div>
          ) : (
            <>
              <div className="px-5 pt-5 pb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">意见反馈 💬</h3>
                <p className="text-xs text-gray-400 mt-1">你的建议对我们很重要</p>
              </div>

              <div className="px-5 pb-5 space-y-4">
                {/* Category */}
                <div className="flex gap-1.5 flex-wrap">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${category === c ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="请描述你的想法或遇到的问题..."
                  rows={3}
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none placeholder:text-gray-400"
                />

                {/* Contact (optional) */}
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="联系方式（选填，方便我们回复你）"
                  className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 placeholder:text-gray-400"
                />

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || submitting}
                  className="btn-primary w-full py-2.5 text-sm"
                >
                  {submitting ? "提交中..." : "提交反馈"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
