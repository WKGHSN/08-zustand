import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const input = await params;
  const TagString = input.slug[0];
  return {
    title: TagString ? `${TagString} Notes` : "All Notes",
    description:
      TagString === "All"
        ? "All stored notes"
        : `The ${TagString} related notes`,
    openGraph: {
      title: TagString ? `${TagString} Notes` : "All Notes",
      description:
        TagString === "All"
          ? "All stored notes"
          : `The ${TagString} related notes`,
      url:
        TagString === "All"
          ? "https://08-zustand-self.vercel.app/notes/filter/All"
          : `https://08-zustand-self.vercel.app/notes/filter/${TagString}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "Note Hub Open Graph Image",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const input = await params;
  const getTagString = input.slug[0] || undefined;
  const filterTag =
    getTagString === "All" || undefined ? undefined : (getTagString as NoteTag);

  const initialData = await fetchNotes({
    page: 1,
    perPage: 12,
    ...(filterTag ? { filterTag } : {}),
  });

  return <NotesClient initialData={initialData} tag={filterTag} />;
}
