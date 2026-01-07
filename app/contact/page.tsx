"use client";

import { useState } from "react";
import axios from "axios";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.number || !formData.message) {
      setSubmitStatus("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post("/api/contact-us", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setSubmitStatus("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", number: "", message: "" });
        setTimeout(() => setSubmitStatus(""), 5000);
      } else {
        setSubmitStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus("Error sending message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              We're here for you
            </h1>
            <p className="text-muted-foreground mb-8">Our friendly team is always here to chat.</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your number <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-background border border-border text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-3 bg-background border border-border text-foreground rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none disabled:bg-muted"
                />
              </div>

              {submitStatus && (
                <div
                  className={`p-4 rounded-md ${
                    submitStatus.includes("successfully")
                      ? "bg-green-900/20 text-green-400 border border-green-800"
                      : submitStatus.includes("Error") || submitStatus.includes("Failed")
                      ? "bg-destructive/20 text-destructive-foreground border border-destructive"
                      : "bg-yellow-900/20 text-yellow-400 border border-yellow-800"
                  }`}
                >
                  {submitStatus}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:bg-muted disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Store Info */}
          <div className="space-y-6">
            <div className="bg-card p-8 rounded-lg shadow-sm border border-border">
              <h2 className="text-3xl font-bold text-foreground mb-6">Store Location</h2>
              <p className="text-muted-foreground leading-relaxed">
                3/183 NAVAMARATHUPATTI, SULLERUMBU POST, DINDIGUL, Tamilnadu 624710.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
