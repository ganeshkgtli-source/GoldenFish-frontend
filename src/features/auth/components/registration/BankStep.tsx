import { Landmark, Shield, User } from "lucide-react";
import FileUpload from "./FileUpload";

export default function BankStep() {
  return (
    <section className="pt-6 border-t border-slate-200 dark:border-slate-800">

      <div className="mb-5">
        {/* <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Bank Details
        </h2> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <div>
  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    Account Number
  </label>

  <div className="relative">
    <Landmark
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
      placeholder="Enter account number"
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
        outline-none
        focus:border-red-500
        focus:ring-4
        focus:ring-red-500/15
      "
    />
  </div>
</div>

       <div>
  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    Account Holder Name
  </label>

  <div className="relative">
    <User
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
      placeholder="Enter account holder name"
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
        outline-none
        focus:border-red-500
        focus:ring-4
        focus:ring-red-500/15
      "
    />
  </div>
</div>

        <div>
  <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    IFSC Code
  </label>

  <div className="relative">
    <Shield
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
      placeholder="Enter IFSC code"
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
        outline-none
        focus:border-red-500
        focus:ring-4
        focus:ring-red-500/15
      "
    />
  </div>
</div>
        
      <div >
        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Passbook Image
        </label>

        <FileUpload
          label="Upload Passbook"
          onChange={() => {}}
        />
      </div>

      </div>


    </section>
  );
}