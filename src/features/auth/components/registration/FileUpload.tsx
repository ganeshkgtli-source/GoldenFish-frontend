import { CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";

interface Props {
  label: string;
  onChange: (file: File | null) => void;
}

export default function FileUpload({
  label,
  onChange,
}: Props) {
  const [fileName, setFileName] =
    useState("");

  return (
    <label
      className="
        group
        relative

        flex
        flex-col
        items-center
        justify-center

        h-[50px]
        w-full

        rounded-xl

        border
        border-dashed
        border-red-300

        bg-transparent

        cursor-pointer

        transition-all
        duration-200

        hover:border-red-500
        hover:bg-red-500/5
      "
    >
      <div className="flex items-center justify-center gap-2">
        {fileName ? (
          <CheckCircle2
            size={14}
            className="text-green-500"
          />
        ) : (
          <Upload
            size={14}
            className="
              text-red-500
              transition-transform
              duration-200
              group-hover:scale-110
            "
          />
        )}

        <p
          className="
            max-w-[220px]

            truncate

            text-sm
            font-semibold

            text-slate-800
            dark:text-white
          "
        >
          {fileName || label}
        </p>
      </div>

      {!fileName && (
        <p
          className="
            text-[11px]
            leading-none

            text-slate-500
            dark:text-slate-400
          "
        >
          JPG, PNG or PDF (Max 5MB)
        </p>
      )}

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => {
          const file =
            e.target.files?.[0] || null;

          setFileName(
            file?.name || ""
          );

          onChange(file);
        }}
      />
    </label>
  );
}