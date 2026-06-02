import { CreditCard } from "lucide-react";
import FileUpload from "./FileUpload";

export default function PanStep() {
  return (
    <section className="pt-6 border-t border-slate-200 dark:border-slate-800">

      {/* Header */}
      {/* <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          PAN Details
        </h2>
      </div> */}

      {/* PAN Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* PAN Number */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            PAN Number
          </label>

       <div className="relative">
  <CreditCard
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
    maxLength={10}
    placeholder="Enter PAN Number"
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

        {/* PAN Upload */}
        <div>
          <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            PAN Card Image
          </label>

          <FileUpload
            label="Upload PAN Card"
            onChange={() => {}}
          />
        </div>

      </div>

    </section>
  );
}