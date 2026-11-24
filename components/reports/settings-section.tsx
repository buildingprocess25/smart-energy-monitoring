export function SettingsSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="grid min-w-0 grid-cols-1 gap-4 border-t py-8 first:border-t-0 first:pt-0 lg:grid-cols-[16rem_minmax(0,40rem)] lg:gap-12"
    >
      <div>
        <h2 id={`${id}-title`} className="text-base font-semibold">
          {title}
        </h2>
        <p className="max-w-[60ch] text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </section>
  )
}
