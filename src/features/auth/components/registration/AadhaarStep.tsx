import { IdCard } from "lucide-react";
import FileUpload from "./FileUpload";

export default function AadhaarStep() {
  return (
    <section className="pt-6 border-t border-slate-200 dark:border-slate-800">

      {/* <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Aadhaar Details
        </h2>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Aadhaar Number */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Aadhaar Number
          </label>
<div className="relative">
  <IdCard
    size={18}
    className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
    "
  />

  <input
    type="text"
    maxLength={12}
    placeholder="Enter 12 digit Aadhaar number"
    className="
      w-full
      h-12

      pl-11
      pr-4

      rounded-xl
      border
      border-slate-300
      dark:border-slate-700

      bg-white
      dark:bg-slate-800

      text-slate-900
      dark:text-white

      placeholder:text-slate-400

      outline-none

      focus:border-red-500
      focus:ring-4
      focus:ring-red-500/15

      transition-all
    "
  />
</div>
        </div>

        {/* Aadhaar Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Aadhaar Card Image
          </label>

          <FileUpload
            label="Upload Aadhaar Card"
            onChange={() => {}}
          />
        </div>

      </div>

    </section>
  );
}