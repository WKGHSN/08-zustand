import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

interface NotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const input = await params;
  const tagString = input.slug[0];
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://08-zustand-self.vercel.app";
  
  return {
    title: tagString ? `${tagString} Notes` : "All Notes",
    description:
      tagString === "All"
        ? "All stored notes"
        : `The ${tagString} related notes`,
    openGraph: {
      title: tagString ? `${tagString} Notes` : "All Notes",
      description:
        tagString === "All"
          ? "All stored notes"
          : `The ${tagString} related notes`,
      url: tagString === "All"
        ? `${baseUrl}/notes/filter/All`
        : `${baseUrl}/notes/filter/${tagString}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tagString ? `${tagString} Notes` : "All Notes",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const input = await params;
  const getTagString = input.slug[0] || undefined;
  
  
  const filterTag = getTagString === "All" ? undefined : (getTagString as NoteTag);

  
  const queryClient = new QueryClient();

 
  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", filterTag],
    queryFn: () => fetchNotes({
      page: 1,
      perPage: 12,
      ...(filterTag ? { filterTag } : {}),
    }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={filterTag} />
    </HydrationBoundary>
  );
}