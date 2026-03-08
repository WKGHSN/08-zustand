"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useDebounce } from "use-debounce";
import type { Note, NoteTag } from "@/types/note";
import css from "./NotesPage.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Link from "next/link";

type FetchNotesResponse = {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalNotes?: number;
  tag?: NoteTag;
};

type Props = {
  initialData: FetchNotesResponse;
  tag?: NoteTag;
};

export default function NotesClient({ initialData, tag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search: debouncedSearch,
        tag: tag,
      }),
    initialData,
    placeholderData: initialData,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        {/* <button className={css.button} onClick={() => setIsModalOpen(true)}> */}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isError && (
        <div>
          <ErrorMessage />
          <button
            className={css.button}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["notes"] })
            }
          >
            Try again ...
          </button>
        </div>
      )}

      {notes.length === 0 && isPending ? (
        <Loader />
      ) : (
        <NoteList notes={notes} />
      )}

      {/* {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )} */}
    </div>
  );
}
