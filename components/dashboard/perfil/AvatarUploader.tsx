"use client";

import { useActionState, useRef, useState } from "react";
import { UserAvatarImage } from "@/components/ui";
import {
  uploadAvatarAction,
  deleteAvatarAction,
  type ActionState,
} from "@/features/profile/actions";
import { resizeImageFile } from "@/lib/utils/image";

interface AvatarUploaderProps {
  userId: string;
  name: string | null;
  email: string;
  avatarUpdatedAt?: number;
}

const initialState: ActionState = {};

export default function AvatarUploader({
  userId,
  name,
  email,
  avatarUpdatedAt,
}: AvatarUploaderProps) {
  const [state, formAction, isPending] = useActionState(
    uploadAvatarAction,
    initialState
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [localVersion, setLocalVersion] = useState(avatarUpdatedAt);
  const [removing, setRemoving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Confirma la versión local una vez que la Server Action termina —
  // estado local de este componente, se deriva en render.
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    // Cualquier valor distinto sirve como cache-buster para el <img> — no
    // hace falta que sea un timestamp real (Date.now() es impuro en render).
    if (state.success) setLocalVersion((v) => (v ?? 0) + 1);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    let resizedBlob: Blob;
    try {
      resizedBlob = await resizeImageFile(file);
    } catch {
      return;
    }

    setPreview(URL.createObjectURL(resizedBlob));

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(
      new File([resizedBlob], "avatar.jpg", { type: "image/jpeg" })
    );
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }

    formRef.current?.requestSubmit();
  }

  async function handleRemove() {
    setRemoving(true);
    await deleteAvatarAction();
    setPreview(null);
    setLocalVersion(undefined);
    setRemoving(false);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        {preview ? (
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview local de un blob recién elegido */}
            <img src={preview} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <UserAvatarImage
            userId={userId}
            name={name}
            email={email}
            avatarUpdatedAt={localVersion}
            size="lg"
          />
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isPending}
          className="absolute -bottom-1 -right-1 w-7 h-7 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors disabled:opacity-60"
          aria-label="Cambiar foto de perfil"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-60"
          >
            {isPending ? "Subiendo..." : "Cambiar foto"}
          </button>
          {localVersion && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="text-xs text-slate-400 hover:text-red-500 disabled:opacity-60"
            >
              {removing ? "Quitando..." : "Quitar"}
            </button>
          )}
        </div>
        {state.message && (
          <p className="text-xs text-red-600 mt-1" role="alert">
            {state.message}
          </p>
        )}
      </div>

      <form ref={formRef} action={formAction} className="hidden">
        <input
          ref={fileInputRef}
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
        />
      </form>
    </div>
  );
}
