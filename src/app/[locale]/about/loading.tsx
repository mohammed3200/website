export default function AboutLoading() {
  return (
    <div className="container mx-auto px-4 py-20 space-y-10">
      <div className="max-w-3xl mx-auto space-y-4 text-center">
        <div className="h-10 w-3/4 mx-auto rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
        <div className="h-6 w-2/3 mx-auto rounded-md bg-stone-200 dark:bg-stone-800 animate-pulse" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-40 rounded-2xl bg-stone-100 dark:bg-stone-800 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
