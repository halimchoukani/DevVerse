import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={24} height={24} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={index} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  "use cache";
  cacheLife("hours");
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();
  if (!event) {
    return notFound();
  }
  const bookings = 10; // Placeholder for bookings count

  const similarEvents = (await getSimilarEventsBySlug(
    slug
  )) as unknown as IEvent[];

  return (
    <section id="event">
      <div className="header">
        <h1>{event.title}</h1>
        <p>{event.description}</p>
      </div>
      <div className="details">
        {/* Left Side */}
        <div className="content">
          <Image
            src={event.image}
            alt={event.title}
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Date Icon"
              label={event.date}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="Time Icon"
              label={event.time}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="Location Icon"
              label={event.location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="Mode Icon"
              label={event.mode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="Audience Icon"
              label={event.audience}
            />
          </section>

          <EventAgenda agendaItems={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About the organizer</h2>
            <p>{event.organizer}</p>
          </section>
          <EventTags tags={event.tags} />
        </div>

        {/* Right Side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who are already booked!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot !</p>
            )}

            <BookEvent eventId={event._id} eventSlug={event.slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents &&
            similarEvents.length > 0 &&
            similarEvents.map((ev: IEvent) => (
              <EventCard key={ev.id} {...ev} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailsPage;
