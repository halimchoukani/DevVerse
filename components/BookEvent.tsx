"use client";
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import { useState } from "react";

const BookEvent = ({
  eventId,
  eventSlug,
}: {
  eventId: string;
  eventSlug: string;
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { success } = await createBooking({
      eventId,
      slug: eventSlug,
      email,
    });
    if (success) {
      setSubmitted(true);
      posthog.capture("event_booked", {
        event_id: eventId,
        event_slug: eventSlug,
        email,
      });
    } else {
      console.error("Booking failed");
      posthog.captureException("Booking failed");
    }
  };

  return (
    <div id="book-event">
      <h2>Book Event</h2>
      {submitted ? (
        <p className="text-sm">Thank you for booking!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <button type="submit" className="button-submit">
            Book Now
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
