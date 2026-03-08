"use client";

import css from "./NoteForm.module.css";
import type { NoteTag, Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { AxiosError } from "axios";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useNoteStore } from "@/lib/store/noteStore";

import { useId } from "react";
import { useRouter } from "next/navigation";

interface NoteFormProps {
  onCancel?: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value } as Partial<FormValues>);
  };

  const { mutate, isPending, isError } = useMutation<
    Note,
    AxiosError<Error>,
    FormValues
  >({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      if (onCancel) {
        onCancel();
      } else {
        router.back();
      }
    },
  });

  const handleCancel = () => {
    // clearDraft();
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const values: FormValues = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    mutate(values);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      {isError && <ErrorMessage />}

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={50}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submit} disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" className={css.cancel} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
