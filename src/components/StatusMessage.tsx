const StatusMessage = ({
  text,
  isError = false,
}: {
  text: string;
  isError?: boolean;
}) => {
  return (
    <div
      className={[
        "max-w-sm mx-auto mt-20 p-6 rounded-xl border text-sm text-center",
        isError
          ? "bg-red-50 border-red-200 text-red-600"
          : "bg-slate-50 border-slate-200 text-slate-500",
      ].join(" ")}
    >
      {text}
    </div>
  );
};

export default StatusMessage;
